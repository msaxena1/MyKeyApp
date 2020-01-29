import React from 'react';
import './Table.css';

const Table = React.memo( ( props ) => {
    const content = props.content;

    const tableContents = Object.keys(content).map( ( key, index ) => (
        <tr key={index}>
            <td><strong>{key}</strong></td>
            <td>{content[key]}</td> 
        </tr>
    ) );

    return (
        <table>
            <tbody>
            {tableContents}
            </tbody>
        </table>
        )
} );

export default Table;
