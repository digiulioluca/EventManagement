import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.html',
  styleUrls: ['./root-component.css'],
  imports: [RouterOutlet, NavbarComponent]
})
export class RootComponent { }
