import { Button, Card, Form, Icon, Input, List, Modal, Result, Typography } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;
const { TextArea } = Input;

interface WalletClassListProps extends FormComponentProps {
  configFinanceWalletClassList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface WalletClassListState {
  visible: boolean; // 对话框是否显示
  done: boolean; // 是否保存成功
  current?: Partial<CardListItemDataType>; // 当前正在查看的记录详情
}

const mapStateToProps = ({
 configFinanceWalletClassList,
 loading,
}: {
  configFinanceWalletClassList: StateType;
  loading: {
    models: { [key: string]: boolean };
  };
}) => ({
  configFinanceWalletClassList,
  loading: loading.models.list,
});

@connect(mapStateToProps)
class WalletClassList extends Component<WalletClassListProps, WalletClassListState> {

  state: WalletClassListState = { visible: false, done: false, current: undefined };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  addBtn: HTMLButtonElement | undefined | null = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'configFinanceWalletClassList/fetch',
      payload: {
        count: 0,
      },
    });
  }

  showModal = () => {
    this.setState({ visible: true, current: undefined, });
  };

  showEditModal = (item: CardListItemDataType) => {
    this.setState({ visible: true, current: item, });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({ done: false, visible: false, });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({ visible: false, });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: CardListItemDataType) => {
      if (err) return;
      this.setState({ done: true, });
      dispatch({
        type: 'configFinanceWalletClassList/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = (id: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configFinanceWalletClassList/submit',
      payload: { id },
    });
  };

  render() {

    const {
      configFinanceWalletClassList: { list },
      loading,
    } = this.props;

    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      visible,
      done,
      current = {}
    } = this.state;

    const editAndDelete = (key: string, currentItem: CardListItemDataType) => {
      if (key === 'edit') {
        this.showEditModal(currentItem);
      } else if (key === 'delete') {
        Modal.confirm({
          title: '删除分类',
          content: '确定删除该分类吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const confirmDelete = (currentItem: CardListItemDataType) => {
      Modal.confirm({
        title: '删除分类',
        content: '确定删除该分类吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(currentItem.id),
      });
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const nullData: Partial<CardListItemDataType> = {};

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            status="success"
            title="操作成功"
            subTitle="一系列的信息描述，很短同样也可以带标点。"
            extra={ <Button type="primary" onClick={this.handleDone}>知道了</Button> }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="分类名称" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入分类名称' }],
              initialValue: current.title,
            })(<Input placeholder="请输入分类名称" />)}
          </FormItem>
          <FormItem label="分类描述" {...this.formLayout}>
            {getFieldDecorator('description', {
              initialValue: current.description,
            })(<TextArea rows={4} placeholder="请输入分类描述" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <>
        <PageHeaderWrapper content={content} extraContent={extraContent}>
          <div className={styles.cardList}>
            <List<Partial<CardListItemDataType>>
              rowKey="id"
              loading={loading}
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={[nullData, ...list]}
              renderItem={item => {
                if (item && item.id) {
                  return (
                    <List.Item key={item.id}>
                      <Card hoverable
                            className={styles.card}
                            actions={[
                              <Icon type="edit" key="edit" title="编辑" onClick={() => this.showEditModal(item)} />,
                              <Icon type="delete" key="delete" title="删除" onClick={() => confirmDelete(item)} />,
                            ]}
                      >
                        <Card.Meta
                          avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                          title={<a>{item.title}</a>}
                          description={
                            <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                              {item.description}
                            </Paragraph>
                          }
                        />
                      </Card>
                    </List.Item>
                  );
                }
                return (
                  <List.Item>
                    <Button type="dashed" className={styles.newButton} onClick={this.showModal} >
                      <Icon type="plus" />新增分类
                    </Button>
                  </List.Item>
                );
              }}
            />
          </div>
        </PageHeaderWrapper>

        <Modal
          title={done ? null : `${(current && current.id) ? '编辑' : '新增'}钱包分类`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >

          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default Form.create<WalletClassListProps>()(WalletClassList);
