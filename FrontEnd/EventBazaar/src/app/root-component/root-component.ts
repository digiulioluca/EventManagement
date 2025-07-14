import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.html',
  styleUrls: ['./root-component.css'],
  imports: [RouterOutlet, NavbarComponent, FooterComponent]
})
export class RootComponent { }
