import React, { Component } from 'react';

class Modal extends Component {

  renderInputes = () => {
    let inputes = this.props.inputes;

    return inputes.map((input, i) => {
      return <input key={i}
          type={input.type} name={input.name} className={input.className} 
          placeholder={input.placeholder || ''} value={input.value} onChange={input.handleChange} />
    })
  }
  
  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <button onClick={this.props.handleClose} className="close">&times;</button>
          {/*this.renderInputes*/}
          {this.props.children}
        </section>
      </div>
    );
  }
}

export default Modal;