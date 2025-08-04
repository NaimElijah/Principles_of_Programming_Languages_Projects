/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).

:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).


% Signature: path(Node1, Node2, Path)/3
% Purpose: Path is a path, denoted by a list of nodes, from Node1 to Node2.

path(A,B,[A,B]) :-  edge(A,B).
path(A,B,[A,C | Ps]) :- edge(A,C),path(C,B,[C | Ps]).




% Signature: cycle(Node, Cycle)/2
% Purpose: Cycle is a cyclic path, denoted a list of nodes, from Node1 to Node1.

cycle(A,P) :- path(A,A,P).



% Signature: reverse(Graph1,Graph2)/2
% Purpose: The edges in Graph1 are reversed in Graph2

reverse([] , []).
reverse([[A,B] | Graph1],[[B,A] | Graph2]) :- reverse(Graph1,Graph2).




% Signature: degree(Node, Graph, Degree)/3
% Purpose: Degree is the degree of node Node, denoted by a Church number (as defined in class)

degree(A,[],zero).
degree(A,[[A,B] | P] , s(D)) :- degree(A,P,D).
degree(A,[[B,C] | P] , D) :- A\=B,degree(A,P,D).










