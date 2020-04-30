import React, { Component } from 'react'

class Table extends Component {
    renderTableData() {
        let rows = this.props.rows;
        if(rows) {
            return rows.map((row, index) => {
               if (this.props.schedule) {
                  const { startTime, endTime, userName, date} = row;
                  return (
                     <tr onClick={()=> this.props.clickRow(row)} key={index}>
                        <td>{userName}</td>
                        <td>{date}</td>
                        <td>{startTime + ' - ' + endTime}</td>
                     </tr>
                  )
               }

               const { id, name, lastname, role, numberOfDuties } = row
               return (
                  <tr onClick={()=>this.props.clickRow(row)} key={id}>
                     <td>{id}</td>
                     <td>{name + " "+ lastname}</td>
                     <td>{role}</td>
                     <td>{numberOfDuties}</td>
                  </tr>
               )
             })
        }
     }
     renderTableHeader() {
        return this.props.column.map((key, index) => {
           return <th key={index} className="tableHeader">{key.toUpperCase()}</th>
        })
     }
  
     render() {
        return (
           <div className="tableDiv">
              <table className="usersTable">
                 <thead>
                    <tr>{this.renderTableHeader()}</tr>
                 </thead>
                 <tbody>
                    {this.renderTableData()}
                 </tbody>
              </table>
           </div>
        )
     }
}

export default Table;