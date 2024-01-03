import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Kindergarden} from './interfaces/Kindergarden';
import {StoreService} from './store.service';
import {Child, ChildResponse} from './interfaces/Child';
import {CHILDREN_PER_PAGE} from './constants';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    constructor(private http: HttpClient, private storeService: StoreService) {
    }

    private isLoadingSubject = new BehaviorSubject<boolean>(true);
    public isLoading = this.isLoadingSubject.asObservable();

    public getKindergardens() {
        this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
            this.storeService.kindergardens = data;
        });
    }

    public getChildren(page: number) {
        this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`, {observe: 'response'}).subscribe(data => {
            this.storeService.children = data.body!;
            this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
            this.isLoadingSubject.next(false);

        });
    }

    public getChildrenForKindergarde(page: number, kindergardenId?: string) {
        let url = `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`;
        if (kindergardenId) {
            url += `&kindergardenId=${kindergardenId}`;
        }

        this.isLoadingSubject.next(true);
        this.http.get<ChildResponse[]>(url, {observe: 'response'})
            .subscribe(
                data => {
                    this.storeService.children = data.body!;
                    this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
                },
                error => {
                    // handle error
                },
                () => this.isLoadingSubject.next(false)
            );
    }

    public addChildData(child: Child, page: number) {
        this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
            this.getChildren(page);
        })
    }

    public deleteChildData(childId: string, page: number) {
        this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_ => {
            this.getChildren(page);
        })
    }
}
