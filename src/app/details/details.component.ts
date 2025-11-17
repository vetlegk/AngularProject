import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../services/housing.service';
import { HousingLocation } from '../interfaces/housing-location';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo" alt="Photo of {{housingLocation?.name}}.">
      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation?.name}}</h2>
        <p class="listing-location">{{housingLocation?.city}}, {{housingLocation?.state}}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">Housing Details</h2>
        <ul>
          <li>Available Units: {{housingLocation?.availableUnits}}</li>
          <li>Wifi: {{housingLocation?.wifi ? 'Yes' : 'No'}}</li>
          <li>Laundry: {{housingLocation?.laundry ? 'Yes' : 'No'}}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply for unit</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName"/>

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName"/>

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email"/>
          <button type="submit" class="primary">Apply for unit</button>
        </form>
      </section>
    </article>
    
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
 route: ActivatedRoute = inject(ActivatedRoute);
 housingLocation: HousingLocation | undefined;
 housingService: HousingService = inject(HousingService);
 applyForm = new FormGroup({
   firstName: new FormControl(''),
   lastName: new FormControl(''),
   email: new FormControl(''),
 });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id'])
    this.housingService.getHousingLocationById(housingLocationId).then(location => {
      this.housingLocation = location;
    });
  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
}
