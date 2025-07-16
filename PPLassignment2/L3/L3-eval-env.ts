// L3-eval.ts
// Evaluator with Environments model

import {find, map} from "ramda";
import {
    isBoolExp, isCExp, isLitExp, isNumExp, isPrimOp, isStrExp, isVarRef,
    isAppExp, isDefineExp, isIfExp, isLetExp, isProcExp,
    Binding, VarDecl, CExp, Exp, IfExp, LetExp, ProcExp, Program,
    parseL3Exp, DefineExp, isBinding, isClassExp, ClassExp
} from "./L3-ast";
import { applyEnv, makeEmptyEnv, makeExtEnv, Env } from "./L3-env-env";
import {
    isClosure,
    makeClosureEnv,
    Closure,
    Value,
    ClassSExp,
    makeObjectSExp,
    makeObjectSExpEnv,
    ObjectSExp, isSymbolSExp, valueToString, makeClassSExp, makeClassSExpEnv, isClassSExp, isObjectSExp
} from "./L3-value";
import { applyPrimitive } from "./evalPrimitive";
import { allT, first, rest, isEmpty, isNonEmptyList } from "../shared/list";
import { Result, makeOk, makeFailure, bind, mapResult } from "../shared/result";
import { parse as p } from "../shared/parser";
import { format } from "../shared/format";

// ========================================================
// Eval functions


const applicativeEval = (exp: CExp, env: Env): Result<Value> =>
    isNumExp(exp) ? makeOk(exp.val) :
    isBoolExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? applyEnv(env, exp.var) :
    isLitExp(exp) ? makeOk(exp.val) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? evalProc(exp, env) :
        isClassExp(exp)? evalClassExp(exp,env):
    isLetExp(exp) ? evalLet(exp, env) :
    isAppExp(exp) ? bind(applicativeEval(exp.rator, env),
                      (proc: Value) =>
                        bind(mapResult((rand: CExp) => 
                           applicativeEval(rand, env), exp.rands),
                              (args: Value[]) =>
                                 applyProcedure(proc, args))) :
    makeFailure('"let" not supported (yet)');

export const isTrueValue = (x: Value): boolean =>
    ! (x === false);

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(applicativeEval(exp.test, env), (test: Value) => 
            isTrueValue(test) ? applicativeEval(exp.then, env) : 
            applicativeEval(exp.alt, env));

const evalProc = (exp: ProcExp, env: Env): Result<Closure> =>
    makeOk(makeClosureEnv(exp.args, exp.body, env));
const evalClassExp = (exp: ClassExp, env: Env): Result<ClassSExp> =>
    makeOk(makeClassSExpEnv(exp.fields,exp.methods,env));



// KEY: This procedure does NOT have an env parameter.
//      Instead we use the env of the closure.
const applyProcedure = (proc: Value, args: Value[]): Result<Value> =>
    isPrimOp(proc) ? applyPrimitive(proc, args) :
    isClosure(proc) ? applyClosure(proc, args) :
        isClassSExp(proc)? applyClass(proc, args):
            isObjectSExp(proc)? applyObject(proc,args):
    makeFailure(`Bad procedure ${format(proc)}`);

const applyClosure = (proc: Closure, args: Value[]): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    return evalSequence(proc.body, makeExtEnv(vars, args, proc.env));
}
const applyClass = (cl: ClassSExp, args: Value[]): Result<Value> =>
{
    const vars = map((v: VarDecl) => v.var, cl.fields);
    return makeOk(makeObjectSExpEnv(cl.methods,makeExtEnv(vars,args,cl.env)));
}
const applyObject = (obj: ObjectSExp,args: Value[]): Result<Value> =>
{
    const func = args[0];
    const expression: undefined|Result<Value>|Binding = args.length!=0&&isSymbolSExp(func) ?
        (find((b: Binding) => b.var.var===func.val ,obj.methods)) :
        makeFailure(`invalid args for Object ${args}`);
    return (expression===undefined) ? makeFailure(`Unrecognized method: ${valueToString(args[0])}`):
        isBinding(expression)?
            bind(applicativeEval(expression.val,obj.env),(x: Value) => isClosure(x)?applyProcedure(x,args.slice(1)):makeOk(x))
            : expression;
}

// Evaluate a sequence of expressions (in a program)
export const evalSequence = (seq: Exp[], env: Env): Result<Value> =>
    isNonEmptyList<Exp>(seq) ? evalCExps(first(seq), rest(seq), env) : 
    makeFailure("Empty sequence");
    
const evalCExps = (first: Exp, rest: Exp[], env: Env): Result<Value> =>
    isDefineExp(first) ? evalDefineExps(first, rest, env) :
    isCExp(first) && isEmpty(rest) ? applicativeEval(first, env) :
    isCExp(first) ? bind(applicativeEval(first, env), _ => evalSequence(rest, env)) :
    first;
    
// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def: DefineExp, exps: Exp[], env: Env): Result<Value> =>
    bind(applicativeEval(def.val, env), (rhs: Value) => 
            evalSequence(exps, makeExtEnv([def.var.var], [rhs], env)));


// Main program
export const evalL3program = (program: Program): Result<Value> =>
    evalSequence(program.exps, makeEmptyEnv());

export const evalParse = (s: string): Result<Value> =>
    bind(p(s), (x) => 
        bind(parseL3Exp(x), (exp: Exp) =>
            evalSequence([exp], makeEmptyEnv())));

// LET: Direct evaluation rule without syntax expansion
// compute the values, extend the env, eval the body.
const evalLet = (exp: LetExp, env: Env): Result<Value> => {
    const vals  = mapResult((v: CExp) => 
        applicativeEval(v, env), map((b: Binding) => b.val, exp.bindings));
    const vars = map((b: Binding) => b.var.var, exp.bindings);
    return bind(vals, (vals: Value[]) => 
        evalSequence(exp.body, makeExtEnv(vars, vals, env)));
}
