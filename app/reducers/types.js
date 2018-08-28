export type counterStateType = {
    +counter: number
};

export type postStateType = {
    +list: [],
    +groups: {},
    +loading: boolean
};

export type postActionType = {
    type: string,
    payload?: {},
};


export type TtStateType = {
    +list: [],
    +loading: boolean,
    +error: boolean
};

export type TtActionType = {
    type: string,
    payload?: {},
};