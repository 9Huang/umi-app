import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { CardListItemDataType } from './data.d';
import {add, queryList, update} from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    submit: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'configFinanceWalletClassList',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      let operateType;
      if (payload && payload.id) {
        let paramsCount = Object.keys(payload).length;
        if (paramsCount > 1) {
          // 修改
          callback = update;
          operateType = "update";
        } else if (paramsCount === 1) {
          // 删除
          operateType = "delete";
        }
      } else {
        // 新增
        callback = add;
        operateType = "add";
      }
      if (callback && operateType) {
        const response = yield call(callback, payload);
        yield put({
          type: operateType,
          payload: response,
        });
      }

    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    submit(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Model;
