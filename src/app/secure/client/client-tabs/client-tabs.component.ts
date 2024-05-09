import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SimpleDialogComponent } from "src/app/_shared/components/simple-dialog/simple-dialog.component";
import { Client, ClientService } from "src/app/_shared/services/client.service";

@Component({
    selector: 'client-tabs',
    templateUrl: './client-tabs.component.html'
})

export class ClientTabsComponent implements OnInit {
  client: Client = {idCliente: 0};
  id: any;
  isEdit = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private clientService: ClientService,
        private dialog: MatDialog
      ) {}

      ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

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
                  data: {type: 'error', message: `Error al obtener los datos del cliente ${this.id}`},
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