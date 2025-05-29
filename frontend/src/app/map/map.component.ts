import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule], // removed CarouselModule
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class AboutComponent {
  imageList = [
    'assets/aboutus.png',
    'assests/20years.png',
    'SAPaboutus.jpg',
  ];
}