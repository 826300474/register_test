export interface DataType {
  id?: string;
  username?: string;
  age?: number;
  address?: string;
  phone?: number;
  createTime?: number;
  modifiedTime?: number;
}

let data: DataType[] = [];

for (let index = 0; index < 20; index++) {
  data.push({
    id: `${index}`,
    username: 'username' + index,
    age: 11,
    address: 'address',
    phone: 18366666666,
    createTime: new Date().valueOf(),
    modifiedTime: new Date().valueOf(),
  });
}

export const queryUsers = () => {
  return Promise.resolve({
    suceess: true,
    list: data.slice(),
    total: data.length,
  });
};

export const createUsers = (body: DataType) => {
  if (data.findIndex((el) => el.username === body.username) > -1) {
    return Promise.resolve({
      suceess: false,
      message: '用户名重复',
    });
  }
  const now = new Date().valueOf();
  const res = {
    ...body,
    id: `${now}`,
    createTime: now,
    modifiedTime: now,
  };
  data.unshift(res);
  return Promise.resolve({
    suceess: true,
    data: res,
    message: '注册成功',
  });
};

export const deleteUsers = (id: string) => {
  const index = data.findIndex((el) => el.id === id);
  data.splice(index, 1);
  return Promise.resolve({
    suceess: true,
    message: '删除成功',
  });
};

export const updateUsers = (body: DataType) => {
  const index = data.findIndex((el) => el.id === body.id);
  data.splice(index, 1);
  data.unshift({
    ...data[index],
    ...body,
    modifiedTime: new Date().valueOf(),
  });

  return Promise.resolve({
    suceess: true,
    message: '更新成功',
  });
};
