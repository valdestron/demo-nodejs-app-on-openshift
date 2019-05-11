import React, { useEffect, useState } from 'react'
import config from '../../config'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import { Container, Row, Col, Button } from 'reactstrap'
import UserList from './UserList'
import NewUserForm from './NewUserForm'

const api = axios.create({
  timeout: 5000,
  withCredentials: true,
})

/**
 * @returns {void} starts the app
 */
export default function Users() {
  const userState = {
    users: null,
    foundUser: null,
    fetchingUsers: false,
    insertingUser: false,
    insertingUserLoading: false,
    findingOneUser: false,
    deletingOneUser: false
  }
  const [state, setState] = useState(userState)

  useEffect(() => {
    fetchUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <section>
    <Container>
      <Row>
        <Col>
          {state.fetchingUsers || !state.users ?
            <Loader type={'Puff'}
              color={'#00BFFF'}
              height={'100'}
              width={'100'} /> :
            <UserList users={state.users} delete={handleDeleteUser} deleting={state.deletingOneUser}/>
          }
        </Col>
      </Row>
      <Row>
        <Col>
          {state.insertingUser &&
            <div>
              {state.insertingUserLoading ?
                <Loader type={'Puff'}
                  color={'#00BFFF'}
                  height={'100'}
                  width={'100'} /> :
                <NewUserForm submit={handleCreateUser}/>}
            </div>}
          {!state.insertingUser && <Button onClick={() => setState({ ...state, ...{ insertingUser: true } })}>Create New User</Button>}
        </Col>
      </Row>
    </Container>
  </section>

  /**
   * @returns {void} starts the app
   */
  async function fetchUsers() {
    setState({ ...state, ...{ fetchingUsers: true } })

    try {
      const { data } = await api.get(`${config.apiUri}/users`)

      if (data.data) {
        setState({ ...state, ...{ users: data.data, fetchingUsers: false } })
      }
    } catch (e) {
      console.error(`Error fetching users, ${e}`)
      return
    }
  }

  /**
   * @param {id} id of user which to delete
   * @returns {void} starts the app
   */
  async function handleDeleteUser(id) {
    setState({ ...state, ...{ deletingOneUser: true } })

    try {
      const { data } = await api.delete(`${config.apiUri}/users/${id}`)
      if (data.status) {
        setState({ ...state, ...{
          users: state.users.filter((user) => user.id !== id),
          deletingOneUser: false
        } })
      }
    } catch (e) {
      console.error(`Error deleting user, ${e}`)
      return
    }
  }

  /**
   * @param {Object} userData user data
   * @returns {void} starts the app
   */
  async function handleCreateUser(userData) {
    setState({ ...state, ...{ insertingUserLoading: true } })

    try {
      const { data } = await api.post(`${config.apiUri}/users`, userData)
      if (data.data) {
        setState({ ...state, ...{
          users: [...state.users, data.data],
          insertingUser: false,
          insertingUserLoading: false
        } })
      }
    } catch (e) {
      console.error(`Error inserting user, ${e}`)
      return
    }
  }

}
