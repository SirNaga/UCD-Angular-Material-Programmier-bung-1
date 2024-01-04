import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BackendService} from 'src/app/shared/backend.service';
import {CHILDREN_PER_PAGE} from 'src/app/shared/constants';
import {StoreService} from 'src/app/shared/store.service';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Sort} from '@angular/material/sort';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

    constructor(public storeService: StoreService, private backendService: BackendService, private snackBar: MatSnackBar) {
    }

    @Input() currentPage!: number;
    @Output() selectPageEvent = new EventEmitter<number>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    public page: number = 0;
    pageSize: number = CHILDREN_PER_PAGE;
    isLoading = true;
    selectedKindergardenId: string | null = null;
    pageSizeOptions: number[] = [2, 5, 10, 20, 50];

    ngOnInit(): void {
        this.filterChildren("");
        this.backendService.getChildren(this.currentPage, this.pageSize);
        this.backendService.isLoading.subscribe(isLoading => {
            this.isLoading = isLoading;
        });
    }


    getAge(birthDate: string) {
        var today = new Date();
        var birthDateTimestamp = new Date(birthDate);
        var age = today.getFullYear() - birthDateTimestamp.getFullYear();
        var m = today.getMonth() - birthDateTimestamp.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
            age--;
        }
        return age;
    }

    getDate(dateString: number) {
        return new Date(dateString);
    }


    public cancelRegistration(childId: string) {
        this.backendService.setPageSize(this.pageSize);
        this.backendService.deleteChildData(childId, this.currentPage);
        this.showDeleteNotification("Kind erfolgreich abgemeldet");
    }

    private showDeleteNotification(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'],
        });
    }

    onPageChange(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.backendService.getChildren(this.currentPage, this.pageSize);
        this.isLoading = true;
    }

    filterChildren(kindergardenId: string) {
        if (kindergardenId === '') {
            this.backendService.getChildren(this.currentPage, this.pageSize);
        } else {
            this.selectedKindergardenId = kindergardenId;
            this.backendService.getChildrenForKindergarde(this.currentPage, kindergardenId);
        }
    }

    sortData(sort: Sort) {
        const data = this.storeService.children;
        if (!sort.active || sort.direction === '') {
            this.storeService.children = data;
            return;
        }

        this.storeService.children = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    console.log("a " + a + " b " + b);
                    return compare(a.name, b.name, isAsc);
                case 'kindergarden':
                    console.log("a " + a + " b " + b);
                    return compare(a.kindergarden.name, b.kindergarden.name, isAsc);
                case 'registrationDate':
                    console.log("a " + a + " b " + b);
                    return compare(a.registrationDate, b.registrationDate, isAsc);
                default:
                    return 0;
            }
        });
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    console.log("a " + a + " b " + b);
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}




