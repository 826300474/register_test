import { useState } from 'react';
import { useAntdTable, useRequest } from 'ahooks';
import moment from 'moment';
import { Button, Table, Form, message, Space, Popconfirm, ConfigProvider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { createUsers, DataType, queryUsers, deleteUsers, updateUsers } from '@/service';
import { ActionType, useModalState } from '@/utils';
import zh_CN from 'antd/es/locale/zh_CN';
import md5 from 'md5';
import RegisterModal from './RegisterModal';
import style from './index.less';

const action_map = {
  Create: {
    title: '新建',
  },
  Read: {
    title: '查看',
  },
  Update: {
    title: '编辑',
  },
}

export default function IndexPage() {

  const [form] = Form.useForm();

  const [actionType, setActionType] = useState<ActionType | null>(null);

  const [state, { showModal, hideModal }] = useModalState(false);

  const { tableProps, refresh } = useAntdTable(queryUsers);

  const createReq = useRequest(createUsers, {
    manual: true,
    onSuccess: (res) => {
      if (res.suceess) {
        message.success(res.message);
        hideModal();
        refresh();
      } else {
        message.error(res.message);
      }
    }
  });

  const updateReq = useRequest(updateUsers, {
    manual: true,
    onSuccess: (res) => {
      if (res.suceess) {
        message.success(res.message);
        hideModal();
        refresh();
      } else {
        message.error(res.message);
      }
    }
  });

  const deleteReq = useRequest(deleteUsers, {
    manual: true,
    onSuccess: (res) => {
      if (res.suceess) {
        message.success(res.message);
        refresh();
      } else {
        message.error(res.message);
      }
    }
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
      width: 200
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 200
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      width: 300,
      render: (_, record) => <div>
        <div>创建时间：{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div>修改时间：{moment(record.modifiedTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    },
    {
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {
            Object.entries(action_map).filter(el => el[0] !== 'Create').map(([key, val]) => <a key={key} onClick={() => {
              setActionType(key as ActionType);
              showModal();
              form.setFieldsValue(record);
            }}>{val.title}</a>)
          }
          <Popconfirm
            placement="topRight"
            title={"是否确认删除？"}
            onConfirm={() => deleteReq.run(record.id)}
            okButtonProps={{ loading: deleteReq.loading }}
            okText="删除"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onButtonClick = () => {
    form.resetFields();
    setActionType('Create');
    showModal();
  }

  const onOk = () => {
    form.validateFields().then(res => {
      //删除确认密码字段
      delete res.confirm;
      //对密码进行加密
      res.password = md5(res.password);
      (actionType === 'Create' ? createReq : updateReq).run(res);
    });
  }

  const onCancel = () => {
    hideModal();
  }

  return (
    <ConfigProvider locale={zh_CN}>
      <div className={style.page}>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={onButtonClick}>注册用户</Button>
        <Table
          scroll={{ x: 1200 }}
          rowKey="id"
          columns={columns}
          {...tableProps}
        />
        <RegisterModal
          actionType={actionType!}
          formProps={{
            disabled: actionType === 'Read',
            form,
          }}
          modalProps={{
            title: `${action_map[actionType!]?.title}用户`,
            okButtonProps: {
              loading: createReq.loading || updateReq.loading
            },
            open: state,
            ...(actionType === 'Read' ? { footer: null } : {}),
            onOk,
            onCancel,
          }}
        />
      </div>
    </ConfigProvider>
  );
}
