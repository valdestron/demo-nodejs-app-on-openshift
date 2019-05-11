import React from 'react'
import { Table, Button } from 'reactstrap'

/**
 * @param {props} props props
 * @returns {void} starts the app
 */
export default function UserList(props) {
  return <section>
    <Table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Username</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((userData, key) => {
          return <tr key={key} className={props.deleting === userData.id ? 'deleted-line' : ''}>
            <td>{userData.id}</td>
            <td>{userData.username}</td>
            <td>{userData.createdAt}</td>
            <td>{userData.updatedAt}</td>
            <td><Button color={'danger'} onClick={() => props.delete(userData.id)}>{props.deleting ? 'Deleting...' : 'Delete'}</Button></td>
          </tr>
        })}
      </tbody>
    </Table>
  </section>
}
