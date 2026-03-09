import { PagedResponse } from '@/types/response';
import axios from './axios';
import { USER_FILTER_ATTRIBUTES } from '@/constants/user.filter-attributes';
import {
  CreateAbstractUserDto,
  UpdateAbstractUserDto,
  ResponseUserDto
} from '@/types/user';

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string,
  search: string = '',
  relations: string[] = ['role']
): Promise<PagedResponse<ResponseUserDto>> => {
  const filter = search
    ? Object.values(USER_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';
  const response = await axios.get<PagedResponse<ResponseUserDto>>(`public/user/list?filter=${filter}`, {
    params: {
      page,
      limit: size,
      sort: `${sortKey},${order}`,
      join: relations.join(',')
    }
  });
  return response.data;
};

const create = async (
  createUserDto: CreateAbstractUserDto
): Promise<ResponseUserDto> => {
  const response = await axios.post<ResponseUserDto>('public/user', createUserDto);
  return response.data;
};

const findById = async (id?: number): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`public/user/${id}`);
  return response.data;
};

const findCurrent = async (): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`public/user/current`);
  return response.data;
};

const update = async (
  id?: number,
  updateRoleDto?: UpdateAbstractUserDto
): Promise<ResponseUserDto> => {
  const response = await axios.put<ResponseUserDto>(`public/user/${id}`, updateRoleDto);
  return response.data;
};

const deactivate = async (id?: number): Promise<ResponseUserDto>=> {
  const response = await axios.put<ResponseUserDto>(`public/user/deactivate/${id}`);
  return response.data;
};

const activate = async (id?: number): Promise<ResponseUserDto> => {
  const response = await axios.put<ResponseUserDto>(`public/user/activate/${id}`);
  return response.data;
};

export const user = {
  findPaginated,
  // findAll,
  findById,
  findCurrent,
  create,
  // duplicate,
  update,
  // remove,
  deactivate,
  activate
};