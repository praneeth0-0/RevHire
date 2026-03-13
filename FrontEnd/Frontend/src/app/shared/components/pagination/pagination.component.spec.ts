import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;

        // Set inputs using signal-based approach if needed, or via helper
        fixture.componentRef.setInput('totalItems', 25);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('currentPage', 1);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate total pages correctly', () => {
        expect(component.totalPages()).toBe(3);
    });

    it('should emit pageChange event when a valid page is selected', () => {
        spyOn(component.pageChange, 'emit');
        component.changePage(2);
        expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should not emit pageChange event for invalid pages', () => {
        spyOn(component.pageChange, 'emit');
        component.changePage(0);
        component.changePage(4);
        expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
});
