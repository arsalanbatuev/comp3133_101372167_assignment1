const bcrypt = require('bcrypt')
const User = require('../models/User')
const Employee = require('../models/Employee')

exports.resolvers = {
  Query: {
    login: async (parent, args) => {
      const { usernameOrEmail, password } = args
      let user = await User.findOne({ username: usernameOrEmail })
      if (!user) {
        user = await User.findOne({ email: usernameOrEmail })
      }
      if (!user) {
        throw new Error('User not found')
      }
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        throw new Error('Invalid password')
      }
      return user
    },
    getAllEmployees: async () => {
      return await Employee.find({})
    },
    getEmployeeById: async (parent, args) => {
      return await Employee.findById(args.eid)
    },
    searchEmployeeByDesignationOrDepartment: async (parent, args) => {
      const query = {}
      if (args.designation) {
        query.designation = new RegExp(args.designation, 'i')
      }
      if (args.department) {
        query.department = new RegExp(args.department, 'i')
      }
      return await Employee.find(query)
    }
  },
  Mutation: {
    signup: async (parent, args) => {
      const { username, email, password } = args
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      })
      return await newUser.save()
    },
    addNewEmployee: async (parent, args) => {
      const newEmployee = new Employee({
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        gender: args.gender,
        designation: args.designation,
        salary: args.salary,
        date_of_joining: new Date(args.date_of_joining),
        department: args.department,
        employee_photo: args.employee_photo
      })
      return await newEmployee.save()
    },
    updateEmployeeById: async (parent, args) => {
      const updateFields = {}
      if (args.first_name) updateFields.first_name = args.first_name
      if (args.last_name) updateFields.last_name = args.last_name
      if (args.gender) updateFields.gender = args.gender
      if (args.designation) updateFields.designation = args.designation
      if (args.salary) updateFields.salary = args.salary
      if (args.date_of_joining) updateFields.date_of_joining = new Date(args.date_of_joining)
      if (args.department) updateFields.department = args.department
      if (args.employee_photo) updateFields.employee_photo = args.employee_photo
      updateFields.updated_at = new Date()
      return await Employee.findByIdAndUpdate(args.eid, updateFields, { new: true })
    },
    deleteEmployeeById: async (parent, args) => {
      return await Employee.findByIdAndDelete(args.eid)
    }
  }
}
