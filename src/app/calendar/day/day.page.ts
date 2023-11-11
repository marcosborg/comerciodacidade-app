import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { SecurityService } from 'src/app/services/security.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DayPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private securityService: SecurityService
  ) { }

  selectedDate: any;
  date!: string;
  access_token!: any;
  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  service!: any;
  employee_id: any;
  shop_schedules: any = [];
  timeSlots: string[] = []; // Array para armazenar os intervalos de tempo
  selectedTimeSlot: string = ''; // Intervalo de tempo selecionado pelo usuário

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const dateParam = params.get('date');
      if (dateParam) {
        this.selectedDate = new Date(dateParam);
        this.date = format(this.selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
      }
      this.loadingController.create().then((loading) => {
        loading.present();
        this.securityService.checkName('access_token').then((resp) => {
          this.access_token = resp.value;
          let data = {
            id: this.id,
            access_token: this.access_token,
          }
          this.securityService.serviceById(data).subscribe((resp) => {
            this.service = resp;
            loading.dismiss();
          });
        });
      });
    });
  }

  logout() {
    this.alertController.create({
      header: 'Tem a certeza?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.router.navigateByUrl('/login');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  onSelect(event: any) {
    this.employee_id = (event.target as HTMLInputElement).value;
    this.generateTimeSlots();
  }

  generateTimeSlots() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        employee_id: this.employee_id,
        date: formatDate(this.selectedDate, 'yyyy-MM-dd', 'en')
      }
      this.securityService.serviceEmployeeSchedules(data).subscribe((resp) => {
        loading.dismiss();
        this.shop_schedules = resp;

        const dayOfWeek = this.selectedDate.getDay();
        let dayOfWeekString: string = '';
        switch (dayOfWeek) {
          case 0:
            dayOfWeekString = 'sunday';
            break;
          case 1:
            dayOfWeekString = 'monday';
            break;
          case 2:
            dayOfWeekString = 'tuesday';
            break;
          case 3:
            dayOfWeekString = 'wednesday';
            break;
          case 4:
            dayOfWeekString = 'thursday';
            break;
          case 5:
            dayOfWeekString = 'friday';
            break;
          case 6:
            dayOfWeekString = 'saturday';
            break;
          default:
            break;
        }

        // Período da manhã
        const startTimeMorning = new Date();
        const openingMorningHours = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_morning_opening'].substring(0, 2);
        const openingMorningMinutes = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_morning_opening'].substring(3, 5);
        startTimeMorning.setHours(openingMorningHours, openingMorningMinutes, 0);

        const closingMorningHours = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_morning_closing'].substring(0, 2);
        const closingMorningMinutes = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_morning_closing'].substring(3, 5);
        const endTimeMorning = new Date();
        endTimeMorning.setHours(closingMorningHours, closingMorningMinutes, 0);

        // Período da tarde
        const startTimeAfternoon = new Date();
        const openingAfternoonHours = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_afternoon_opening'].substring(0, 2);
        const openingAfternoonMinutes = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_afternoon_opening'].substring(3, 5);
        startTimeAfternoon.setHours(openingAfternoonHours, openingAfternoonMinutes, 0);

        const closingAfternoonHours = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_afternoon_closing'].substring(0, 2);
        const closingAfternoonMinutes = this.service.data.shop_company.shop_company_schedules[dayOfWeekString + '_afternoon_closing'].substring(3, 5);
        const endTimeAfternoon = new Date();
        endTimeAfternoon.setHours(closingAfternoonHours, closingAfternoonMinutes, 0);

        const timeSlotDuration = 30;
        const currentTime = new Date(); // Obtém a data e hora atual

        if (this.selectedDate.toDateString() === currentTime.toDateString()) {
          // É o dia corrente, aplicar restrição de hora atual

          while (startTimeMorning < endTimeMorning && startTimeMorning > currentTime) {
            const timeSlotMorning = this.formatTime(startTimeMorning);
            this.timeSlots.push(timeSlotMorning);
            startTimeMorning.setMinutes(startTimeMorning.getMinutes() + timeSlotDuration);
          }

          while (startTimeAfternoon < endTimeAfternoon && startTimeAfternoon > currentTime) {
            const timeSlotAfternoon = this.formatTime(startTimeAfternoon);
            this.timeSlots.push(timeSlotAfternoon);
            startTimeAfternoon.setMinutes(startTimeAfternoon.getMinutes() + timeSlotDuration);
          }
        } else {
          // É um dia futuro, adicionar todos os slots de tempo

          while (startTimeMorning < endTimeMorning) {
            const timeSlotMorning = this.formatTime(startTimeMorning);
            this.timeSlots.push(timeSlotMorning);
            startTimeMorning.setMinutes(startTimeMorning.getMinutes() + timeSlotDuration);
          }

          while (startTimeAfternoon < endTimeAfternoon) {
            const timeSlotAfternoon = this.formatTime(startTimeAfternoon);
            this.timeSlots.push(timeSlotAfternoon);
            startTimeAfternoon.setMinutes(startTimeAfternoon.getMinutes() + timeSlotDuration);
          }
        }
      });
    });
  }

  formatTime(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  selectTimeSlot(timeSlot: string) {
    this.selectedTimeSlot = timeSlot;
    let data = {
      start_time: formatDate(this.selectedDate, 'yyyy-MM-dd', 'en') + ' ' + this.selectedTimeSlot + ':00',
      employee_id: this.employee_id,
      service_id: this.id,
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data)
      }
    };

    this.router.navigate(['service-checkout'], navigationExtras);
  }

  getAppointmentStatus(timeSlot: string): string {
    const appointments = this.shop_schedules; // Agendamentos do funcionário
    const isSlotOccupied = appointments.some((appointment: any) => {
      const appointmentStartTime = new Date(appointment.start_time);
      const appointmentEndTime = new Date(appointment.end_time);
      const slotTime = new Date(this.selectedDate);
      slotTime.setHours(Number(timeSlot.split(':')[0]), Number(timeSlot.split(':')[1]), 0);
      return slotTime >= appointmentStartTime && slotTime < appointmentEndTime;
    });

    if (isSlotOccupied) {
      return 'Indisponível'; // Slot de tempo ocupado
    } else {
      return 'Disponível'; // Slot de tempo disponível
    }
  }

  isTimeSlotValid(timeSlot: string): boolean {
    const serviceDuration = this.service.data.service_duration.minutes;
    const timeSlotDuration = 30; // Duração do slot de tempo em minutos
    const slotsNeeded = serviceDuration / timeSlotDuration;

    const index = this.timeSlots.indexOf(timeSlot);
    if (index === -1) {
      return false; // Slot de tempo não encontrado
    }

    // Verifique se há slots de tempo suficientes consecutivos disponíveis
    for (let i = index; i < index + slotsNeeded; i++) {
      if (!this.isSlotAvailable(this.timeSlots[i])) {
        return false; // Slot de tempo não disponível
      }
    }

    return true; // Todos os slots de tempo necessários estão disponíveis
  }

  isSlotAvailable(timeSlot: string): boolean {
    const appointments = this.shop_schedules; // Agendamentos do funcionário

    // Verifique se o slot de tempo está ocupado
    const isSlotOccupied = appointments.some((appointment: any) => {
      const appointmentStartTime = new Date(appointment.start_time);
      const appointmentEndTime = new Date(appointment.end_time);
      const slotTime = new Date(this.selectedDate);
      slotTime.setHours(Number(timeSlot.split(':')[0]), Number(timeSlot.split(':')[1]), 0);
      return slotTime >= appointmentStartTime && slotTime < appointmentEndTime;
    });

    return !isSlotOccupied;
  }


}
