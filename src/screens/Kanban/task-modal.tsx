import { Button, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { TaskTypeSelect } from 'components/task-type-select'
import { UserSelect } from 'components/user-select'
import { useEffect } from 'react'
import { useDeleteTask, useEditTask } from 'utils/task'
import { useTasksModal, useTasksQueryKey } from './util'

// antd自带样式
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export const TaskModal = () => {
  const [form] = useForm()
  const { editingTaskId, editingTask, close } = useTasksModal()

  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  )

  const onCancel = () => {
    close()
    form.resetFields()
  }

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() })
    close()
  }

  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey())

  const startDelete = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确定删除任务吗',
      onOk() {
        // 关闭Modal
        close()
        return deleteTask({ id: Number(editingTaskId) })
      }
    })
  }

  // 当[form,editingTask]改变的时候，form改变值
  useEffect(() => {
    form.setFieldsValue(editingTask)
  }, [form, editingTask])

  return (
    <Modal
      // Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={'确认'}
      cancelText={'取消'}
      confirmLoading={editLoading}
      title={'编辑任务'}
      visible={!!editingTaskId}
    >
      <Form {...layout} initialValues={editTask} form={form}>
        <Form.Item
          label={'任务名'}
          name={'name'}
          rules={[{ required: true, message: '请输入任务名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={'经办人'} name={'processorId'}>
          <UserSelect defaultOptionName={'经办人'} />
        </Form.Item>
        <Form.Item label={'类型'} name={'typeId'}>
          <TaskTypeSelect />
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={startDelete}
          style={{ fontSize: '14px' }}
          size={'small'}
        >
          删除
        </Button>
      </div>
    </Modal>
  )
}
