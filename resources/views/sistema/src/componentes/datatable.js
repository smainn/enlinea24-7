import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

  const SYMBOLS = {
    ASC: "sort--asc",
    DESC: "sort--desc",
    NONE: "sort--none",
  }

  const getNewSortOrder = ({column, sortBy, sortOrder}) => {
    if(sortOrder === 'ASC') {
      return 'DESC'
    }
    return 'ASC'
  }

  const getCurrentSortOrder = ({column, sortBy, sortOrder}) => {
    if(sortBy === column) {
      return SYMBOLS[sortOrder]
    }
    return SYMBOLS['NONE']
  }

  const sortColumnBy = (column, sortOrder) => (a, b) => {
    if(a[column] < b[column]) {
      return sortOrder === 'ASC' ? -1 : 1
    }
    if(a[column] > b[column]) {
      return sortOrder === 'ASC' ? 1 : -1
    }
    return 0
  }

  const formatData = ({data, column, sortOrder}) => {
    if(!column) {
      return data
    }
    return [...data].sort(sortColumnBy(column, sortOrder))
  }

  const Pagination = () => {
    return (
      <nav className="pagination">
        <button className="page-item" aria-label="Previous page">&lt;</button>
        <button className="pagination__button" aria-label="First page">&laquo;</button>
        <button className="pagination__button" aria-label="Last page">&raquo;</button>
        <button className="pagination__button" aria-label="Next page">&gt;</button>
      </nav>
    )
  }

export default class CDatatable extends Component {
    
    constructor() {
        super()
        this.setSortOrder = this.setSortOrder.bind(this)
        this.state = {
          sortBy: null,
          sortOrder: null,
        }
    }

    setSortOrder(column) {
        return (e) => {
          this.setState(state => ({
            sortBy: column,
            sortOrder: getNewSortOrder({
              column, 
              sortBy: state.sortBy, 
              sortOrder: state.sortOrder
            }),
          }))  
        }
    }


    render() {
        const { sortOrder, sortBy } = this.state
        const data = formatData({
            data: this.props.data,
            column: sortBy,
            sortOrder: sortOrder
        })
        const header = Object.keys(data[0])
        return (
            <table cellPadding="0" cellSpacing="0" className="table table-bordered table-hover">
                <thead>
                    <tr>
                        {header.map(cell => (
                        <th key={cell}>
                            <button
                            aria-label={`Sort column ${cell}`}
                            className={`sort ${getCurrentSortOrder({column: cell, sortBy, sortOrder})}`}
                            onClick={this.setSortOrder(cell)}
                            > {cell}
                            </button> 
                        </th>
                        ))}
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colSpan={header.length}>
                        <Pagination />
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        {Object.values(row).map(cell => (
                            <td key={cell}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}