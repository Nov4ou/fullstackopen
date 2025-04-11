import axios from "axios";
// const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = "/api/persons"

const getAll = () => {
  return axios.get(baseUrl)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  console.log(request.data)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  // debugger
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deletePhonebook = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll: getAll,
  create: create,
  update: update,
  deletePhonebook: deletePhonebook
}