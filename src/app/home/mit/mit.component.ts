import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounce } from 'debounce';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MitService } from 'src/app/services/mit.service';

@Component({
  selector: 'app-mit',
  templateUrl: './mit.component.html',
  styleUrls: ['./mit.component.scss'],
})
export class MitComponent implements OnInit, OnDestroy {
  mitSub: Subscription;
  mitId: any;
  mit: string;
  mitDate: string;
  date: Date = new Date();
  currentDate: Array<any> = [];
  monthNames = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };
  dayNames = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  };

  constructor(private mitService: MitService) {}
  /**
   * Make the date format and set it right
   */
  ngOnInit() {
    this.mitService
      .getMit()
      .pipe(take(1))
      .subscribe((mitData: any) => {
        this.mit = mitData[0].mitString;
        this.mitId = mitData[0].id;
      });
    this.currentDate.push(this.date.getMonth());
    this.currentDate.push(this.date.getDate());
    this.currentDate.push(this.date.getFullYear());
    this.mitDate = `${this.dayNames[this.currentDate[0]]}, ${
      this.monthNames[this.currentDate[0]]
    } ${this.currentDate[1]}${this.determineSuffix()}, ${this.currentDate[2]}`;
  }
  /**
   * Determine the right suffix for the date
   */
  determineSuffix(): string {
    // determine the suffix based on the dictionary
    switch (this.currentDate[1]) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  /**
   *
   * @param ev
   * SAVE THE MIT TO THE DB
   */
  async saveMit(ev: any) {
    console.log(ev);
    debounce(await this.mitService.saveMit(this.mitId, ev.value), 200);
  }
  /**
   * Unsub from the sub
   */
  ngOnDestroy(): void {
    this.mitSub.unsubscribe();
  }
}
