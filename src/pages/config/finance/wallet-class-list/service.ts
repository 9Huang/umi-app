import request from '@/utils/request';
import { CardListItemDataType } from './data';

interface ParamsType extends Partial<CardListItemDataType> {
  count?: number;
}

export async function queryList(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/queryAll', {
    params,
  });
}

export async function add(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/insert', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/update', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteById(params: ParamsType) {
  return request('/pims/config/finance/wallet/class/deleteById', {
    method: 'DELETE',
    params: { id: params.id },
  });
}
