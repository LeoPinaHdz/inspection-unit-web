import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SimpleDialogComponent } from "src/app/_shared/components/simple-dialog/simple-dialog.component";
import { Client } from "src/app/_shared/models/client.model";
import { ClientService } from "src/app/_shared/services/client.service";
import { CountryService } from "src/app/_shared/services/country.service";
import { StateService } from "src/app/_shared/services/state.service";

@Component({
  selector: 'client-tabs',
  templateUrl: './client-tabs.component.html'
})

export class ClientTabsComponent implements OnInit {
  client: Client = { idCliente: 0 };
  id: any;
  countries: any[] = [];
  states: any[] = [];
  isEdit = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private dialog: MatDialog,
    private countryService: CountryService,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.countryService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.countries = response;
        },
        error: () => {
          console.error('Error trying to get countries');
        }
      });
    this.stateService.getAll()
      .pipe()
      .subscribe({
        next: (response) => {
          this.states = response;
        },
        error: () => {
          console.error('Error trying to get states');
        }
      });

    if (this.id) {
      this.isEdit = true;
      this.clientService.getById(this.id)
        .pipe()
        .subscribe({
          next: (response) => {
            this.client = response;
          },
          error: () => {
            this.dialog.open(SimpleDialogComponent, {
              data: { type: 'error', message: `Error al obtener los datos del cliente ${this.id}` },
            })
              .afterClosed()
              .subscribe(() => {
                this.router.navigate([`/secure/clients`]);
              });
            console.error('Error trying to get client detail');
          }
        });
    }
  }
}