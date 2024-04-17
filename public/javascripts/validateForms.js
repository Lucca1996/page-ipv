(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

const validateInputs = () => {
    const inputs = document.querySelectorAll('input[required]')
    Array.from(inputs).forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.nextElementSibling.querySelector('.valid-feedback').classList.remove('hidden')
                input.nextElementSibling.querySelector('.invalid-feedback').classList.add('hidden')
            } else {
                input.nextElementSibling.querySelector('.valid-feedback').classList.add('hidden')
                input.nextElementSibling.querySelector('.invalid-feedback').classList.remove('hidden')
            }
        })
    })
}

validateInputs()