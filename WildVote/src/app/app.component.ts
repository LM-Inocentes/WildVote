import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebcamComponent } from "./components/webcam/webcam.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, WebcamComponent]
})
export class AppComponent {
  title = 'WildVote';
}
