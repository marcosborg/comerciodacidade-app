import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.page.html',
  styleUrls: ['./month.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MonthPage implements OnInit {

  currentMonth!: string;
  daysOfWeek: string[] = [];
  weeks!: number[][];
  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  service: any;
  sun: boolean = false;
  mon: boolean = false;
  tue: boolean = false;
  wed: boolean = false;
  thu: boolean = false;
  fri: boolean = false;
  sut: boolean = false;
  currentDate = new Date();

  constructor(
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.currentMonth = format(this.currentDate, 'MMMM yyyy', { locale: ptBR });
    this.daysOfWeek = ['Dom', 'Seg', 'Ter', 'qua', 'qui', 'Sex', 'Sáb'];
    this.generateCalendar(this.currentDate);
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

  previousMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousDate = new Date(this.currentDate);
    previousDate.setMonth(previousDate.getMonth() - 1);

    const previousMonth = previousDate.getMonth();
    const previousYear = previousDate.getFullYear();

    if (previousYear > currentYear || (previousYear === currentYear && previousMonth >= currentMonth)) {
      this.currentDate = previousDate;
      this.currentMonth = format(this.currentDate, 'MMMM yyyy', { locale: ptBR });
      this.generateCalendar(this.currentDate);
    }
  }



  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentMonth = format(this.currentDate, 'MMMM yyyy', { locale: ptBR });
    this.generateCalendar(this.currentDate);
  }

  generateCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const weeks: number[][] = [];

    let currentWeek: number[] = [];
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(0);
    }

    for (let day = 1; day <= lastDay; day++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push(currentWeek);
    }

    this.weeks = weeks;
  }

  isWorkingDay(day: number): boolean {
    const schedules = this.service.data.shop_company.shop_company_schedules;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Dias anteriores ao mês atual
    }

    if (year === currentYear && month === currentMonth && day < currentDay) {
      return false; // Dias anteriores ao dia atual
    }

    const dayOfWeek = new Date(year, month, day).getDay();

    if (year === currentYear && month === currentMonth && day === currentDay) {
      // Verificar horário apenas para o dia atual
      switch (dayOfWeek) {
        case 0:
          return checkOpeningHours(schedules.sunday_morning_opening, schedules.sunday_morning_closing, schedules.sunday_afternoon_closing);
        case 1:
          return checkOpeningHours(schedules.monday_morning_opening, schedules.monday_morning_closing, schedules.monday_afternoon_closing);
        case 2:
          return checkOpeningHours(schedules.tuesday_morning_opening, schedules.tuesday_morning_closing, schedules.tuesday_afternoon_closing);
        case 3:
          return checkOpeningHours(schedules.wednesday_morning_opening, schedules.wednesday_morning_closing, schedules.wednesday_afternoon_closing);
        case 4:
          return checkOpeningHours(schedules.thursday_morning_opening, schedules.thursday_morning_closing, schedules.thursday_afternoon_closing);
        case 5:
          return checkOpeningHours(schedules.friday_morning_opening, schedules.friday_morning_closing, schedules.friday_afternoon_closing);
        case 6:
          return checkOpeningHours(schedules.saturday_morning_opening, schedules.saturday_morning_closing, schedules.saturday_afternoon_closing);
        default:
          return false;
      }
    } else {
      // Outros dias do mês
      return true;
    }

    function checkOpeningHours(morningOpening: string | undefined, morningClosing: string | undefined, afternoonClosing: string | undefined): boolean {
      const morningClosingHour = morningClosing ? parseInt(morningClosing.split(':')[0]) : -1;
      const afternoonClosingHour = afternoonClosing ? parseInt(afternoonClosing.split(':')[0]) : -1;

      if (morningClosing && currentHour > morningClosingHour) {
        return false; // Indisponível se a hora atual for superior ao horário de encerramento da manhã
      }

      if (afternoonClosing && currentHour > afternoonClosingHour) {
        return false; // Indisponível se a hora atual for superior ao horário de encerramento da tarde
      }

      return morningOpening !== undefined || afternoonClosing !== undefined;
    }
  }

  goDay(day: number) {
    if (this.isWorkingDay(day)) {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const date = new Date(year, month, day);
      this.router.navigateByUrl('day/' + this.id + '/' + date.toISOString());
    }
  }

}
