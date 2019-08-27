import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { CardListItemDataType } from './data.d';
import { add, deleteById, queryList, update } from './service';

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
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    submit: Reducer<StateType>;
    add: Reducer<StateType>;
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
          // 如果记录id存在，且参数个数大于1，则说明此时是编辑操作
          callback = update;
          operateType = 'update';
        } else if (paramsCount === 1) {
          // 如果记录id存在，且参数个数等于1，则说明此时是删除操作
          callback = deleteById;
          operateType = 'delete';
        }
      } else {
        // 如果记录id不存在，则说明此时是新增操作
        callback = add;
        operateType = 'add';
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
    add(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

export default Model;
