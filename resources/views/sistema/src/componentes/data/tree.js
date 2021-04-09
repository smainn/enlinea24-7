
import React, { Component } from 'react';
import { Tree, Icon, Dropdown, Menu } from 'antd';
const { TreeNode } = Tree;
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import C_Button from './button';
import C_CheckBox from './checkbox';
import C_Input from './input';

export default class C_Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            checked_tree: false,
        }
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onDropDownData(data) {
        data.visible = !data.visible;
        if (typeof this.props.onDropDown != 'undefined') {
            this.props.onDropDown(data);
        }
    }
    onMenu(data) {
        return (
            <Menu style={{padding: 3}}>
                <Menu.Item key="0"
                    onClick={() => {
                        data.visible = !data.visible;
                        if (typeof this.props.onCreate != 'undefined') {
                            this.props.onCreate(data);
                        }
                    }}
                >
                    Adicionar
                </Menu.Item>
                <Menu.Item key="1"
                    onClick={() => {
                        data.visible = !data.visible;
                        if (typeof this.props.onEdit != 'undefined') {
                            this.props.onEdit(data);
                        }
                    }}
                >
                    Editar
                </Menu.Item>
                {(typeof this.props.onShow == 'undefined')?null:
                    <Menu.Item key="2"
                        onClick={() => {
                            data.visible = !data.visible;
                            if (typeof this.props.onEdit != 'undefined') {
                                this.props.onShow(data);
                            }
                        }}
                    >
                        ver
                    </Menu.Item>
                }
                <Menu.Item key="3"
                    onClick={() => {
                        data.visible = !data.visible;
                        if (typeof this.props.onDelete != 'undefined') {
                            this.props.onDelete(data);
                        }
                    }}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    }
    renderTreeNode(data) {
        var array = [];
        data.map(item => {
            if (item.children) {
                const menu = this.onMenu(item);
                array.push(
                <TreeNode title={
                    <label style={{paddingRight: 5, cursor: 'pointer'}}>
                        {(this.props.showcodigo)?item.codigo+' '+item.title:item.title}
                        <Dropdown overlay={menu} trigger={['click']} 
                            visible={item.visible}
                            onVisibleChange={this.onDropDownData.bind(this, item)}
                        >
                            <Icon type="more"
                                style={{position: 'relative', padding: 1, 
                                    paddingTop: 3, paddingBottom: 3,
                                    cursor: 'pointer', left: 28, top: -3,
                                    border: '1px solid #e8e8e8',
                                }}
                            />
                        </Dropdown>
                    </label>
                } 
                    key={item.id} dataRef={item}
                >
                        {this.renderTreeNode(item.children)}
                    </TreeNode>
                );
            }
        });
        return array;
    }
    onChangeCheckedTree() {
    
        this.setState({
            checked_tree: !this.state.checked_tree,
        });
        if (this.state.checked_tree) {
            this.setState({
                expandedKeys: [],
            });
        }else {
            var array = [];
            var data = this.props.data;
            this.activarTodos(data, array);
        }
    }
    activarTodos(data, array) { 
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].children.length > 0) {
                array.push(data[i].id.toString());
                this.setState({
                    expandedKeys: array,
                });
            }
            this.activarTodos(data[i].children, array);
        }
    }
    render() {
        return (
            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                <div className="forms-groups">
                    <C_Input 
                        value={(this.state.checked_tree)?'Contraer':'Expandir'}
                        readOnly={true}
                        className='cols-lg-4 cols-md-4 cols-sm-4 cols-xs-12 padding-0'
                        style={{cursor: 'pointer', 
                            background: 'white',
                        }}
                        onClick={this.onChangeCheckedTree.bind(this)}
                        suffix={
                            <C_CheckBox
                                style={{marginTop: -3,}}
                                onChange={this.onChangeCheckedTree.bind(this)}
                                checked={this.state.checked_tree}
                            />
                        }
                    />
                </div>
                <div className='forms-groups' 
                    style={{border: '1px solid #e8e8e8', paddingTop: 0}}
                >
                    <Tree style={{'height': '100%', maxHeight: 450, overflowY: 'scroll'}}
                        showLine={this.props.showLine}
                        //switcherIcon={<Icon type="down" />}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onExpand={this.onExpand.bind(this)}
                    >
                        {this.renderTreeNode(this.props.data)}
                    </Tree>
                </div>
                <div className='forms-groups'>
                    <div className='txts-center'>
                        <C_Button title=''
                            type='primary'
                            style={{width: '100%', padding: 10}}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

C_Tree.propTypes = {
    style: PropTypes.object,
    showLine: PropTypes.bool,
    data: PropTypes.array,
    onDropDown: PropTypes.func,
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onShow: PropTypes.func,
    onChangeCheckedTree: PropTypes.func,
    showcodigo: PropTypes.bool,
}

C_Tree.defaultProps = {
    style: {},
    showLine: false,
    data: [],
    onDropDown: undefined,
    onCreate: undefined,
    onEdit: undefined,
    onDelete: undefined,
    onShow: undefined,
    onChangeCheckedTree: undefined,
    showcodigo: false,
}