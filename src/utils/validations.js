const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/

export const emailValidate = val => emailPattern.test(val) || 'Please enter a valid email address'
export const requiredValidate = val => !!val || 'This textfield is required'