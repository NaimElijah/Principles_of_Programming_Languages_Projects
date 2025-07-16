import {
 ClassExp,
 ProcExp,
 Exp,
 Program,
 makeProcExp,
 Binding,
 CExp,
 IfExp,
 makeIfExp,
 makePrimOp,
 makeBoolExp,
 makeAppExp,
 makeVarDecl,
 makeVarRef,
 isExp,
 isDefineExp,
 makeDefineExp,
 isProgram,
 makeProgram,
 isAtomicExp, isAppExp, isIfExp, isProcExp, isLetExp, makeLetExp, isLitExp, isClassExp, makeLitExp
} from "./L3-ast";
import {Result, makeFailure, bind, mapResult, makeOk} from "../shared/result";
import {map, reduce} from "ramda";
import {makeSymbolSExp} from "./L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
 export const class2proc = (exp: ClassExp): ProcExp =>
     makeProcExp(exp.fields,[bodyMaker(exp.methods)]);

 const bodyMaker = (methods: Binding[]): CExp =>
     makeProcExp([makeVarDecl('msg')],
         [reduce((acc: CExp, elem: Binding) => toIfWithEq(elem.var.var,elem.val,acc) ,makeBoolExp(false),methods.reverse())]);
const toIfWithEq = (methodName: string,then: CExp, alt: CExp): CExp =>
    makeIfExp(makeAppExp(makePrimOp('eq?'),[makeVarRef('msg') ,makeLitExp(makeSymbolSExp(methodName))]),makeAppExp(then,[]),alt);
/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
 export const lexTransform = (exp: Exp | Program): Result<Exp | Program> =>
     isProgram(exp)? bind(mapResult((x) => lexTransformHelper1(x),exp.exps),(x) => makeOk(makeProgram(x))):
         lexTransformHelper1(exp);

const lexTransformHelper1 = (exp: Exp): Result<Exp> =>
    isDefineExp(exp)? bind(lexTransformHelper2(exp.val),(x) => makeOk(makeDefineExp(exp.var,x))):
        lexTransformHelper2(exp);

const lexTransformHelper2 = (exp: CExp): Result<CExp> =>
    isAtomicExp(exp)? makeOk(exp):
        isAppExp(exp)? bind(lexTransformHelper2(exp.rator),(rator) =>
            bind(mapResult((x)=> lexTransformHelper2(x),exp.rands),(rands) => makeOk(makeAppExp(rator,rands)))):
            isIfExp(exp)? bind(lexTransformHelper2(exp.test),(test) =>
            bind(lexTransformHelper2(exp.then),(then) => bind(lexTransformHelper2(exp.alt), (alt) =>
            makeOk(makeIfExp(test,then,alt))))):
                isProcExp(exp)? bind(mapResult((x) => lexTransformHelper2(x),exp.body),(body) => makeOk(makeProcExp(exp.args,body))):
                    isLetExp(exp)?  bind(mapResult((x) => lexTransformHelper2(x),exp.body),(body) => makeOk(makeLetExp(exp.bindings,body))):
                   isLitExp(exp)? makeOk(exp):
                       isClassExp(exp)? makeOk(class2proc(exp)): makeFailure("never");

