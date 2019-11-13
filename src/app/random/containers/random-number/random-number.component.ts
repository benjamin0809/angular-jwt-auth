import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RandomNumberService } from '../../services/random-number.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random-number',
  templateUrl: './random-number.component.html',
  styleUrls: ['./random-number.component.css']
})
export class RandomNumberComponent implements OnInit {

  randomNumber: Observable<number>;

  constructor(private random: RandomNumberService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.randomNumber = this.random.getRandomNumber();
    const user: Observable<any> = this.random.getGetUser();
    user.subscribe(res => {
      console.log('user', res);
    }, error => {
      console.error('user', error);
    });

    const user1: Observable<any> = this.random.getGetUser();
    user1.subscribe(res => {
      console.log('user1', res);
    }, error => {
      console.error('user1', error);
    });

    const user2: Observable<any> = this.random.getGetUser();
    user2.subscribe(res => {
      console.log('user2', res);
    }, error => {
      console.error('user2', error);
    });

    // const user13: Observable<any> = this.random.getGetUserV1();
    // user13.subscribe(res => {
    //   console.log('user13', res);
    // }, err => {
    //   console.error('user13', err);
    // });
  }

  getuser() {
    const user1: Observable<any> = this.random.getGetUser();
    user1.subscribe(res => {
      console.log('user1', res);
    }, error => {
      console.error('user1', error);
    });
  }
  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/login']);
        }
      });
  }

}
