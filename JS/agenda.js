if (!user) {
  window.location.href = "/HTML-Pages/login.html";
}

document.addEventListener('DOMContentLoaded', function () {
  let selectedDate = null;
  let isMedico = false;

  const validateUserIsMedico = () => {
    getMedics()
      .then(medics => {
        medics.forEach(medico => {
          if (medico.dni === user.dni) {
            isMedico = true;
            validateShowAppointmentHistory();
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  validateUserIsMedico();

  // Calendario
  const daysContainer = document.querySelector(".days");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const month = document.querySelector(".month");
  const todayBtn = document.querySelector(".today-btn");

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // obtener dia actual
  const date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();
  // fin Calendario *****************************************************

  //appointments/citas 
  const appointmentContainer = document.getElementById("appointment-container");
  const appointmentForm = document.getElementById("appointment-form");
  const appointmentsContainer = document.getElementById('appointments');

  //Formulario Programar Cita ***************************************
  const dateInput = document.getElementById('date');
  const specialtySelect = document.getElementById('specialty');
  const doctorSelect = document.getElementById('doctor');
  const scheduleSelect = document.getElementById('schedule');
  const newAppointmentForm = document.getElementById('new-appointment-form');
  const scheduleAppointmentButton = document.getElementById('scheduleAppointmentButton');

  newAppointmentForm.addEventListener('submit', handleFormSubmit);
  // fin Formulario Programar Cita ********************************

  // Tabla Historial de Citas *********************************************
  const showHistoryButton = document.getElementById('showHistoryButton');
  const historyContainer = document.getElementById('table-container');
  //fin Tabla Historial de Citas *****************************************

  //Calendario *************************************************
  // function to render days
  function renderCalendar() {

    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    month.innerHTML = `${months[currentMonth]} ${currentYear}`;

    // actualizar días
    let days = "";

    // prev days
    for (let x = firstDay.getDay(); x > 0; x--) {
      days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
    }

    // dias del mes actual
    for (let i = 1; i <= lastDayDate; i++) {
      if (
        i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        // si es hoy
        days += `<div class="day today">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }

    // dias siguientes
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next">${j}</div>`;
    }
    hideTodayBtn();
    daysContainer.innerHTML = days;

    //Cargar citas
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const userCitas = citas.filter(cita => (cita.dniPaciente === user.dni || cita.dniMedico === user.dni) && cita.estado != "cancelada");

    // Elementos visuales del calendario
    const loadedDays = document.querySelectorAll('.day');
    loadedDays.forEach(day => {
      const dayOfMonth = parseInt(day.textContent);
      const dayDate = new Date(currentYear, currentMonth, dayOfMonth);
      if (selectedDate != null && dayDate.getTime() === selectedDate.getTime()
        && !day.classList.contains("next") && !day.classList.contains("prev")) {
        day.classList.add('selected');
      }
      userCitas.forEach(cita => {
        const citaDateParts = cita.fecha.split('-'); // Dividir la cadena de fecha en partes
        const citaYear = parseInt(citaDateParts[0]); // Obtener el año
        const citaMonth = parseInt(citaDateParts[1]) - 1; // Obtener el mes (restar 1 porque los meses en JavaScript son 0 indexados)
        const citaDay = parseInt(citaDateParts[2]); // Obtener el día
        const citaDate = new Date(citaYear, citaMonth, citaDay); // Crear la instancia de Date con la fecha de la cita
        const citaDateNormalized = new Date(citaDate.getFullYear(), citaDate.getMonth(), citaDate.getDate()); // Crear una nueva instancia de Date sin la hora
        const dayDateNormalized = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()); // Crear una nueva instancia de Date sin la hora
        if (citaDateNormalized.getTime() === dayDateNormalized.getTime()) {
          day.classList.add('user-appointment');
        }
      });



    });
  }

  renderCalendar();

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  // ir al dia de hoy
  todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();
    renderCalendar();
  });

  function hideTodayBtn() {
    if (
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      todayBtn.style.display = "none";
    } else {
      todayBtn.style.display = "flex";
    }
  }

  function updateSelectedButton(clickedDay) {
    const allDays = document.querySelectorAll('.day');
    allDays.forEach(day => {
      day.classList.remove('selected');
    });
    clickedDay.classList.add("selected");
  }

  // Mostrar el formulario de programar cita al hacer clic en un día del calendario
  daysContainer.addEventListener("click", function (event) {
    const clickedDay = event.target;
    if (clickedDay.classList.contains("day") && !clickedDay.classList.contains("next") && !clickedDay.classList.contains("prev")) {

      // Obtener el día y la fecha correspondiente al día seleccionado
      const dayOfMonth = clickedDay.textContent; // Obtener el día del mes
      const clickedDate = new Date(currentYear, currentMonth, dayOfMonth); // Crear fecha con el día seleccionado
      const today = new Date();
      if (clickedDate < today) {
        alert("No puedes agendar en una fecha anterior a la actual!");
      } else {

        selectedDate = clickedDate;

        renderAppointments();

        //Mostrar citas de ese dia
        showAppointmentContainer();

        updateSelectedButton(clickedDay);

        llenarEspecialidades();

        if (!isMedico) {
          // Mostrar el formulario de cita
          showAppointmentForm();

          // Llenar el campo de fecha en el formulario con la fecha seleccionada
          document.getElementById('date').valueAsDate = clickedDate;
        }
      }
    }
  });

  // Mostrar contenedor de citas agendadas
  function showAppointmentContainer() {
    appointmentContainer.style.display = "block";
  }

  // Mostrar formulario de nueva cita
  function showAppointmentForm() {
    appointmentForm.style.display = "block";
  }

  // fin Calendario ****************************************

  // Ver citas *****************************************

  function renderAppointments() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const userCitas = citas.filter(cita => (cita.dniPaciente === user.dni || cita.dniMedico === user.dni) && cita.estado != "cancelada");

    // Limpiar contenido anterior
    appointmentsContainer.innerHTML = '';

    // Obtener el año, mes y día de la fecha seleccionada
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    // Crear una nueva instancia de Date sin la hora para la fecha seleccionada
    const selectedDateNormalized = new Date(selectedYear, selectedMonth, selectedDay);

    // Filtrar citas que coincidan con la fecha seleccionada
    userCitas.forEach(cita => {
      // Dividir la cadena de fecha en partes
      const citaDateParts = cita.fecha.split('-');

      // Obtener el año, mes y día de la fecha de la cita
      const citaYear = parseInt(citaDateParts[0]);
      const citaMonth = parseInt(citaDateParts[1]) - 1; // Restar 1 porque los meses en JavaScript son 0 indexados
      const citaDay = parseInt(citaDateParts[2]);

      const citaDate = new Date(citaYear, citaMonth, citaDay);

      // Crear una nueva instancia de Date sin la hora para la fecha de la cita
      const citaDateNormalized = new Date(citaDate.getFullYear(), citaDate.getMonth(), citaDate.getDate());

      // Comparar si la fecha normalizada de la cita coincide con la fecha seleccionada normalizada
      if (citaDateNormalized.getTime() === selectedDateNormalized.getTime()) {
        const appointmentElement = document.createElement('div');
        appointmentElement.classList.add('appointment');
        const appointmentInfo = document.createElement('p');

        getMedicByDni(cita.dniMedico)
          .then(medico => {
            appointmentInfo.textContent = `Fecha: ${cita.fecha}, Hora: ${cita.hora}, Especialidad: ${cita.especialidad}, ${(isMedico) ? "Paciente: " + cita.dniPaciente : "Médico: " + medico.nombre}, Estado: ${cita.estado}`;

            // Botón para cancelar la cita
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar';
            cancelButton.classList.add('cancel');
            cancelButton.addEventListener('click', () => {
              cita.estado = 'cancelada';
              actualizarEstadoCita(cita);
              renderAppointments();
              fillAppointmentsTable();
            });

            appointmentElement.appendChild(appointmentInfo);
            if (isMedico) {
              // Botón para aprobar la cita
              const approveButton = document.createElement('button');
              approveButton.textContent = 'Aprobar';
              approveButton.classList.add('approve');
              approveButton.addEventListener('click', () => {
                cita.estado = 'aceptada';
                actualizarEstadoCita(cita);
                renderAppointments();
              });

              appointmentElement.appendChild(approveButton);

            }
            appointmentElement.appendChild(cancelButton);
            appointmentsContainer.appendChild(appointmentElement);

          })
          .catch(error => {
            console.error(error.message); // Médico no encontrado
          });
      }
    });
  }

  function actualizarEstadoCita(cita) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];

    // Buscar la cita en el arreglo de citas
    const index = citas.findIndex(c => c.fecha === cita.fecha && c.hora === cita.hora && c.dniMedico === cita.dniMedico && c.dniPaciente === cita.dniPaciente);

    // Si se encontró la cita, actualizar su estado
    if (index !== -1) {
      citas[index].estado = cita.estado;

      // Guardar el arreglo actualizado en el localStorage
      localStorage.setItem('citas', JSON.stringify(citas));
      return true; // Retorna verdadero si se actualizó con éxito
    } else {
      return false; // Retorna falso si la cita no fue encontrada
    }
  }

  // fin Ver citas *****************************************

  //Formulario ****************************************

  // Función para llenar el select "specialty" con las especialidades de los médicos
  function llenarEspecialidades() {
    specialtySelect.innerHTML = '<option value="1">Selecciona una especialidad...</option>';
    llenarMedicos(1);
    llenarHorarios(1);

    // Obtener los médicos
    getMedics()
      .then(medicos => {
        const especialidades = [];

        // buscar medicos para obtener las especialidades
        medicos.forEach(medico => {
          if (!especialidades.includes(medico.especialidad)) { //si no está en el arreglo la agrega
            especialidades.push(medico.especialidad);
            const option = document.createElement('option');
            option.textContent = medico.especialidad;
            option.value = medico.especialidad;
            specialtySelect.appendChild(option);
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Llenar el select "specialty" con las especialidades disponibles
  llenarEspecialidades();

  specialtySelect.addEventListener('change', function () {
    const especialidadSeleccionada = specialtySelect.value;
    llenarMedicos(especialidadSeleccionada);
    llenarHorarios(1);
  });

  // Función para llenar el select "doctor" con los médicos de la especialidad seleccionada
  function llenarMedicos(especialidadSeleccionada) {
    doctorSelect.innerHTML = ''; // Limpiar opciones anteriores
    if (especialidadSeleccionada == 1) {
      doctorSelect.innerHTML = '<option value="1">Selecciona una especialidad...</option>';
      return;
    }
    doctorSelect.innerHTML = '<option value="1">Selecciona un médico</option>';

    // Obtener médicos
    getMedics()
      .then(medicos => {
        // Filtrar por especialidad seleccionada
        const medicosFiltrados = medicos.filter(medico => medico.especialidad === especialidadSeleccionada);
        medicosFiltrados.forEach(medico => {
          const option = document.createElement('option');
          option.textContent = medico.nombre;
          option.value = medico.dni;
          doctorSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  function llenarHorarios(medicoSeleccionado) {
    scheduleSelect.innerHTML = '';    // Limpiar opciones anteriores
    scheduleAppointmentButton.disabled = true;

    if (medicoSeleccionado == 1) {
      scheduleSelect.disabled = true;
      return;
    }

    const diaSeleccionado = selectedDate.toLocaleDateString('es-ES', { weekday: 'narrow' }); // Obtener el día de la semana

    // Obtener al médico seleccionado
    getMedicByDni(medicoSeleccionado)
      .then(medico => {

        // Verificar si el médico trabaja en el día seleccionado
        if (!(diaSeleccionado in medico.horario)) {
          alert("El medico seleccionado no trabaja este dia, favor revisar horarios de atención");
          scheduleSelect.disabled = true;
          return;
        }

        // Obtener los horarios del médico para el día seleccionado
        const horarioDiaSeleccionado = medico.horario[diaSeleccionado];
        const horaInicio = parseInt(horarioDiaSeleccionado.inicio.split(':')[0]);
        const horaFin = parseInt(horarioDiaSeleccionado.fin.split(':')[0]); // Obtener solo la hora (ignorando minutos)

        // Crear opciones para los horarios disponibles
        for (let hora = horaInicio; hora < horaFin; hora++) {
          const option = document.createElement('option');
          option.textContent = `${hora}:00 - ${hora + 1}:00`;
          option.value = `${hora}:00`; // hora
          scheduleSelect.appendChild(option);
        }
        // Habilitar el select de horarios
        scheduleSelect.disabled = false;
        changeScheduleAppointmentButton();
      })
      .catch(error => {
        console.error(error.message); // Médico no encontrado
      });

  } // llenarHorarios()


  // Escuchar cambios en el select de médicos
  doctorSelect.addEventListener('change', function () {
    const medicoSeleccionado = doctorSelect.value;
    llenarHorarios(medicoSeleccionado);
    changeScheduleAppointmentButton();
  });

  // fin Formulario ****************************************


  // Programar Cita **************************************
  function changeScheduleAppointmentButton() {
    if (validateScheduleForm()) {
      scheduleAppointmentButton.disabled = false;
    } else {
      scheduleAppointmentButton.disabled = true;
    }
  }

  function validateScheduleForm() {
    if (dateInput.value != null && specialtySelect.value != null && specialtySelect.value != 1
      && doctorSelect.value != null && scheduleSelect.value != "") {
      return true;
    } else {
      return false;
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (validateScheduleForm()) {
      cita = generarCita(dateInput.value, scheduleSelect.value, specialtySelect.value, doctorSelect.value, user.dni);
      alert(programarCita(cita));
      renderCalendar();
      renderAppointments();
      fillAppointmentsTable();
    }
  };

  // Cita(Fecha, Hora, Especialidad, dniMedico, dniPaciente, estado(pendiente, aprobada, cancelada))
  function generarCita(fecha, hora, especialidad, dniMedico, dniPaciente) {
    return {
      fecha: fecha,
      hora: hora,
      especialidad: especialidad,
      dniMedico: dniMedico,
      dniPaciente: dniPaciente,
      estado: 'pendiente' // Estado por defecto
    };
  }

  // Función para guardar una cita en localStorage
  function guardarCita(cita) {
    const citas = localStorage.getItem('citas') ? JSON.parse(localStorage.getItem('citas')) : [];
    citas.push(cita);
    localStorage.setItem('citas', JSON.stringify(citas));
  }

  // Función para verificar si hay solapamiento de citas para un médico en un determinado horario
  function haySolapamiento(citas, nuevaCita) {
    return citas.some(cita => {
      return cita.dniMedico === nuevaCita.dniMedico &&
        cita.fecha === nuevaCita.fecha &&
        cita.hora === nuevaCita.hora &&
        cita.estado !== "cancelada";
    });
  }

  function esIgual(citas, nuevaCita) {
    return citas.some(cita => {
      return cita.dniMedico === nuevaCita.dniMedico &&
        cita.fecha === nuevaCita.fecha &&
        cita.hora === nuevaCita.hora &&
        cita.estado === "cancelada";
    });
  }

  // Función para programar una nueva cita
  function programarCita(nuevaCita) {
    const citas = localStorage.getItem('citas') ? JSON.parse(localStorage.getItem('citas')) : [];

    // Verificar si hay solapamiento con otras citas
    if (haySolapamiento(citas, nuevaCita)) {
      return 'Ya existe una cita programada en ese horario';
    }

    if (esIgual(citas, nuevaCita)) {
      nuevaCita.estado = 'pendiente';
      actualizarEstadoCita(nuevaCita);
      return 'Cita programada con éxito';
    }
    // Guardar la cita
    guardarCita(nuevaCita);
    return 'Cita programada con éxito';
  }
  // fin Programar Cita **************************************

  //historial de citas
  // Función para llenar la tabla con el historial de citas del usuario
  function fillAppointmentsTable() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const userCitas = citas.filter(cita => cita.dniPaciente === user.dni);
    const tableBody = document.getElementById('table-body');

    // Limpiar contenido anterior
    tableBody.innerHTML = '';
    userCitas.forEach(cita => {
      const row = document.createElement('tr');

      // Crear las celdas de la fila con los datos de la cita
      const dateCell = document.createElement('td');
      dateCell.textContent = cita.fecha;
      row.appendChild(dateCell);

      const timeCell = document.createElement('td');
      timeCell.textContent = cita.hora;
      row.appendChild(timeCell);

      const specialtyCell = document.createElement('td');
      specialtyCell.textContent = cita.especialidad;
      row.appendChild(specialtyCell);

      const doctorCell = document.createElement('td');
      getMedicByDni(cita.dniMedico)
        .then(medico => {
          doctorCell.textContent = medico.nombre;
        })
        .catch(error => {
          console.error(error.message); // Médico no encontrado
        });
      row.appendChild(doctorCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = cita.estado;
      row.appendChild(statusCell);

      tableBody.appendChild(row);
    });
  }

  function validateShowAppointmentHistory() {
    if (isMedico) {
      showHistoryButton.style.display = 'none';
    }
  };


  // botón "Mostrar Historial de Citas"
  showHistoryButton.addEventListener('click', function () {
    // Alternar la visibilidad del contenedor de historial
    if (historyContainer.style.display === 'none' || historyContainer.style.display === '') {
      fillAppointmentsTable();
      historyContainer.style.display = 'block'; // Mostrar historial si está oculto
      showHistoryButton.textContent = 'Ocultar Historial de Citas'; // Cambiar texto del botón
    } else {
      historyContainer.style.display = 'none'; // Ocultar historial si está visible
      showHistoryButton.textContent = 'Mostrar Historial de Citas'; // Cambiar texto del botón
    }
  });

  //historial de citas

});
