// ========================================================
// Value type definition for L4

import {isPrimOp, CExp, PrimOp, VarDecl, Binding, isClassExp} from './L3-ast';
import { Env, makeEmptyEnv } from './L3-env-env';
import { append } from 'ramda';
import { isArray, isNumber, isString } from '../shared/type-predicates';
import {isObject} from "util";


export type Value = SExpValue;

export type Functional = PrimOp | Closure;
export const isFunctional = (x: any): x is Functional => isPrimOp(x) || isClosure(x);

// ========================================================
// Closure for L4 - the field env is added.
// We also use a frame-based representation of closures as opposed to one env per var.
export type Closure = {
    tag: "Closure";
    params: VarDecl[];
    body: CExp[];
    env: Env;
}

export type ClassSExp = {
    tag: "ClassSExp";
    fields: VarDecl[];
    methods: Binding[];
    env: Env;
}
export type ObjectSExp =
    {
        tag: "ObjectSExp";
        methods:Binding[];
        env: Env;
    }
export const makeClosure = (params: VarDecl[], body: CExp[]): Closure =>
    ({tag: "Closure", params: params, body: body, env : makeEmptyEnv()});


export const makeClassSExp =  (fields: VarDecl[], methods: Binding[]): ClassSExp =>
    ({tag:"ClassSExp", fields:fields, methods:methods, env: makeEmptyEnv()});
export const makeClassSExpEnv =  (fields: VarDecl[], methods: Binding[], env:Env): ClassSExp =>
    ({tag:"ClassSExp", fields:fields, methods:methods, env})
export const makeObjectSExp = (methods: Binding[]): ObjectSExp =>
    ({tag:"ObjectSExp",methods:methods, env: makeEmptyEnv()});
export const makeObjectSExpEnv = (methods: Binding[],env: Env): ObjectSExp =>
    ({tag:"ObjectSExp",methods:methods, env:env});

export const makeClosureEnv = (params: VarDecl[], body: CExp[], env: Env): Closure =>
    ({tag: "Closure", params: params, body: body, env: env});
export const isClosure = (x: any): x is Closure => x.tag === "Closure";

// ========================================================
// SExp
export type CompoundSExp = {
    tag: "CompoundSexp";
    val1: SExpValue;
    val2: SExpValue;
}
export type EmptySExp = {
    tag: "EmptySExp";
}
export type SymbolSExp = {
    tag: "SymbolSExp";
    val: string;
}

export type SExpValue = number | boolean | string | PrimOp | Closure | SymbolSExp | EmptySExp | CompoundSExp |
    ClassSExp | ObjectSExp;
export const isSExp = (x: any): x is SExpValue =>
    typeof(x) === 'string' || typeof(x) === 'boolean' || typeof(x) === 'number' ||
    isSymbolSExp(x) || isCompoundSExp(x) || isEmptySExp(x) || isPrimOp(x) || isClosure(x) || isClassSExp(x)
    || isObjectSExp(x);

export const makeCompoundSExp = (val1: SExpValue, val2: SExpValue): CompoundSExp =>
    ({tag: "CompoundSexp", val1: val1, val2 : val2});
export const isCompoundSExp = (x: any): x is CompoundSExp => x.tag === "CompoundSexp";


export const isClassSExp = (x: any): x is ClassSExp => x.tag === "ClassSExp";
export const isObjectSExp = (x: any): x is ObjectSExp => x.tag ==="ObjectSExp"
export const makeEmptySExp = (): EmptySExp => ({tag: "EmptySExp"});
export const isEmptySExp = (x: any): x is EmptySExp => x.tag === "EmptySExp";

export const makeSymbolSExp = (val: string): SymbolSExp =>
    ({tag: "SymbolSExp", val: val});
export const isSymbolSExp = (x: any): x is SymbolSExp => x.tag === "SymbolSExp";

// LitSExp are equivalent to JSON - they can be parsed and read as literal values
// like SExp except that non functional values (PrimOp and Closures) can be embedded at any level.
export type LitSExp = number | boolean | string | SymbolSExp | EmptySExp | CompoundSExp;

// Printable form for values
export const closureToString = (c: Closure): string =>
    // `<Closure ${c.params} ${L3unparse(c.body)}>`
    `<Closure ${c.params} ${c.body}>`
export const classToString = (c : ClassSExp): string => 'Class'
    //`<Class ${c.fields} ${c.methods}>`
export const objectToString = (o : ObjectSExp): string => 'Object'
   // `<Class ${o.methods}>`
export const compoundSExpToArray = (cs: CompoundSExp, res: string[]): string[] | { s1: string[], s2: string } =>
    isEmptySExp(cs.val2) ? append(valueToString(cs.val1), res) :
    isCompoundSExp(cs.val2) ? compoundSExpToArray(cs.val2, append(valueToString(cs.val1), res)) :
    ({ s1: append(valueToString(cs.val1), res), s2: valueToString(cs.val2)})
 
export const compoundSExpToString = (cs: CompoundSExp, css = compoundSExpToArray(cs, [])): string => 
    isArray(css) ? `(${css.join(' ')})` :
    `(${css.s1.join(' ')} . ${css.s2})`

export const valueToString = (val: Value): string =>
    isNumber(val) ?  val.toString() :
    val === true ? '#t' :
    val === false ? '#f' :
    isString(val) ? `"${val}"` :
    isClosure(val) ? closureToString(val) :
    isPrimOp(val) ? val.op :
    isSymbolSExp(val) ? val.val :
    isEmptySExp(val) ? "'()" :
    isCompoundSExp(val) ? compoundSExpToString(val) :
        isClassSExp(val) ? classToString(val):
            isObjectSExp(val) ? objectToString(val):
    val;
