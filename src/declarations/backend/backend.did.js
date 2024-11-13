export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getHistory' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat))], ['query']),
    'rollDice' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], []),
  });
};
export const init = ({ IDL }) => { return []; };
