import request from '@/utils/request';
import { CardListItemDataType } from './data';

// 定义参数类型
interface ParamsType extends Partial<CardListItemDataType> {
  status?: number;
}

// 查询钱包分类
export async function queryList(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/queryAll', {
    params,
  });
}

// 新增钱包分类
export async function add(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/insert', {
    method: 'POST',
    data: params,
  });
}

// 更新钱包分类
export async function update(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/update', {
    method: 'PUT',
    data: params,
  });
}

// 删除钱包分类
export async function deleteById(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/deleteById', {
    method: 'DELETE',
    params: { id: params.id },
  });
}
