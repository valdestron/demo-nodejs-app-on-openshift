import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

/**
 * @param {props} props props
 * @returns {void} starts the app
 */
export default function NewUserForm(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Label for="Username">Username</Label>
      <Input type="text" name="text" id="username" placeholder="Whats your username ?" value={username}
        onChange={(e) => setUsername(e.target.value)}/>
    </FormGroup>
    <FormGroup>
      <Label for="Username">Name</Label>
      <Input type="text" name="text" id="name" placeholder="Whats your name ?" value={name}
        onChange={(e) => setName(e.target.value)}/>
    </FormGroup>
    <FormGroup>
      <Label for="password">Password</Label>
      <Input type="password" name="password" id="password" placeholder="Your password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>
    </FormGroup>
    <Button type={'submit'}>Create</Button>
  </Form>

  /**
   * @param {Event} e submit event
   * @returns {void} starts the app
   */
  function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    props.submit({ username, password, name })
  }
}
