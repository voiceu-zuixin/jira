import styled from '@emotion/styled'
import { Button, Drawer, Form, Input, Spin } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ErrorBox } from 'components/lib'
import UserSelect from 'components/user-select'
import { useEffect } from 'react'
import {
  useAddProject,
  useEditProject,
  useProjectsMoal,
  useProjectsQueryKey
} from 'utils/project'

export default function ProjectModal() {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectsMoal()

  const title = editingProject ? '编辑项目' : '创建项目'

  // 判断当前是编辑还是新建
  const useMutateProject = editingProject ? useEditProject : useAddProject
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading
  } = useMutateProject(useProjectsQueryKey())

  // antd内置的hook
  const [form] = useForm()

  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      // 用form重置表单
      form.resetFields()
      close()
    })
  }

  useEffect(() => {
    form.setFieldsValue(editingProject)
  }, [editingProject, form])

  return (
    <Drawer
      forceRender={true}
      onClose={close}
      visible={projectModalOpen}
      width={'100%'}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={'vertical'}
              style={{ width: '40rem' }}
              onFinish={onFinish}
            >
              <Form.Item
                label={'名称'}
                name={'name'}
                rules={[
                  {
                    required: true,
                    message: '请输入项目名'
                  }
                ]}
              >
                <Input placeholder={'请输入项目名称'} />
              </Form.Item>

              <Form.Item
                label={'部门'}
                name={'organization'}
                rules={[
                  {
                    required: true,
                    message: '请输入部门名'
                  }
                ]}
              >
                <Input placeholder={'请输入部门名称'} />
              </Form.Item>

              <Form.Item label={'负责人'} name={'personId'}>
                <UserSelect defaultOptionName={'负责人'} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right' }}>
                <Button
                  loading={mutateLoading}
                  type={'primary'}
                  htmlType={'submit'}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  )
}

const Container = styled.div`
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
