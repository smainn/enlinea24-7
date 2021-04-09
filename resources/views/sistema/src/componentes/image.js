
import React, { Component } from 'react';
import { Upload, Icon } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default class CImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
            isOpen: false,
            indexImg: 0,
        }

        this.deleteImg = this.deleteImg.bind(this);
    }

    componentDidMount() {
        
    }

    componentImg() {
        let {images, image, index} = this.props;
        //console.log('IMAGES ', images);
        //console.log('IMAGE ', image);
        //console.log('INDEX ', index);
        if (image != '' && image != null && image != undefined) {
            images.length === 0 ? images.push(image) : images[0] = image;
        }
        if (images.length === 0) {
            return (
                <img 
                    src='/images/default.jpg' alt="none" 
                    className="img-principal" 
                />
            )
            
        } else {
            return (
                <div onClick={() => this.setState({ isOpen: true })}>
                    <img 
                        style={{'cursor': 'pointer'}}
                        //onClick={this.abrirModalImage.bind(this)}
                        src={images[index]}
                        alt="none" className="img-principal" 
                    />
                </div>
                
            );
        }
    }

    lighBox() {
        const { isOpen } = this.state;
        if (isOpen) {
            const { index }  = this.props;
            const nextSrc = this.props.images.length <= 1 ? null : this.props.images[(index + 1) % this.props.images.length];
            const prevSrc = this.props.images.length <= 1 ? null : this.props.images[(index + this.props.images.length - 1) % this.props.images.length];
            return (
                <Lightbox
                    mainSrc={this.props.images[index]}
                    nextSrc={nextSrc}
                    prevSrc={prevSrc}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    onMovePrevRequest={this.props.prev}
                    onMoveNextRequest={this.props.next}
                />
            );
        }
        return null;
    }

    nextIcon() {
        if (this.props.images.length > 1) {
            return (
                <div className="pull-left-content">
                    <i className="fa-left-content fa fa-angle-double-left"
                        onClick={this.props.next}> 
                    </i>
                </div>
            );
        }
        return null;
    }

    prevIcon() {
        if (this.props.images.length > 1) {
            return (
                <div className="pull-right-content">
                    <i className="fa-right-content fa fa-angle-double-right"
                        onClick={this.props.prev}> 
                    </i>
                </div>
            );
        }
        return null;
    }

    deleteImg() {
        this.props.delete();
    }

    deleteIcon() {
        if (this.props.permisions.editable == 'N') return null;
        if ((this.props.images.length > 0 && !this.props.modeView) || this.props.image != '') {
            return (
                <div className="pull-right-content">
                    <i 
                        className="styleImg-content fa fa-trash"
                        style={{'right': '5px'}}
                        onClick={this.deleteImg}>
                    </i>
                </div>
            );
        }
        return null;
    }

    uploadImg() {
        if (this.props.modeView || this.props.permisions.editable == 'N') return null;
        return (
            <div className="pull-left-content">
                <i className="styleImg-content fa fa-upload" style={{'left': '5px'}}>
                    <input 
                        type="file" 
                        className="img-content"
                        onChange={this.props.onChange}/>
                </i>
            </div>
        );
    }

    verificarPermisos() {
        var nextIcon = this.nextIcon();
        var prevIcon = this.prevIcon();
        var deleteIcon = this.deleteIcon();
        var componentImg = this.componentImg();
        var lighBox = this.lighBox();
        var uploadImg = this.uploadImg();
        const { readOnly } = this.props;
        if (this.props.permisions.visible == 'A') {
            return (
                <div>
                    { lighBox }
                    <div className="card-caracteristica">

                        { readOnly ? null : uploadImg }

                        { readOnly ? null : deleteIcon }
                        <div 
                            className="caja-img caja-altura"
                            style={this.props.style}
                        >
                            { componentImg }
                        </div>
                        { nextIcon }
                        { prevIcon }
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const verificarPermisos = this.verificarPermisos();
        return (
            <>
            { verificarPermisos } 
            </>
        );
    }
}

CImage.propTypes = {
    images: PropTypes.array,
    image: PropTypes.string,
    main: PropTypes.number,
    next: PropTypes.func,
    prev: PropTypes.func,
    delete: PropTypes.func,
    openModal: PropTypes.bool,
    closeModal: PropTypes.bool,
    onMovePrev: PropTypes.func,
    onMoveNext: PropTypes.func,
    index: PropTypes.number,
    style: PropTypes.object,
    modeView: PropTypes.bool, //modo ver
    permisions: PropTypes.object,
}

CImage.defaultProps = {
    images: [],
    image: '',
    index: 0,
    style: {},
    next: undefined,
    prev: undefined,
    modeView: false, //modo ver
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    readOnly: false
}