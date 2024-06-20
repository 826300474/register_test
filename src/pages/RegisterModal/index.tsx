import { Form, FormProps, Input, InputNumber, Modal, ModalProps } from 'antd';

interface IProps {
	modalProps?: ModalProps
	formProps?: FormProps
}

const RegisterModal: React.FC<IProps> = (props) => {
	const { modalProps, formProps } = props;

	return <Modal
		{...modalProps}
	>
		<Form
			name="basic"
			labelCol={{ span: 4 }}
			wrapperCol={{ span: 20 }}
			autoComplete="off"
			{...formProps}
		>
			<Form.Item
				name="id"
				hidden
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="姓名"
				name="username"
				rules={[
					{ required: true, message: '请输入姓名!' },
					{
						min: 2,
						max: 10,
						message: '姓名长度必须在2到10个字符之间！',
					},
				]}
			>
				<Input placeholder="请输入姓名" />
			</Form.Item>

			<Form.Item
				label="手机号"
				name="phone"
				rules={[
					{ required: true, message: '请输入手机号!' },
					{
						pattern: /^1[3-9]\d{9}$/,
						message: '手机号格式不正确！',
					},
				]}
			>
				<Input placeholder="请输入手机号" />
			</Form.Item>

			<Form.Item
				name="age"
				label="年龄"
				rules={[
					{ required: true, message: '请输入年龄!' },
					{ type: 'number', min: 1, max: 150, message: '年龄必须在1~150之间' }]}
			>
				<InputNumber style={{ width: '100%' }} placeholder="请输入年龄" />
			</Form.Item>

			<Form.Item
				label="密码"
				name="password"
				rules={[
					{ required: true, message: '请输入密码!' },
					{
						min: 6,
						max: 18,
						message: '密码长度必须在6到18个字符之间！',
					},
				]}
			>
				<Input.Password placeholder="请输入密码" />
			</Form.Item>

			<Form.Item
				name="confirm"
				label="确认密码"
				dependencies={['password']}
				hasFeedback
				rules={[
					{
						required: true,
						message: '请输入密码!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('您输入的两个密码不一致!'));
						},
					}),
				]}
			>
				<Input.Password placeholder="请输入确认密码" />
			</Form.Item>

			<Form.Item
				name="address"
				label="家庭地址"
			>
				<Input.TextArea showCount maxLength={100} placeholder="请输入家庭地址" />
			</Form.Item>
		</Form>
	</Modal>
};

export default RegisterModal;