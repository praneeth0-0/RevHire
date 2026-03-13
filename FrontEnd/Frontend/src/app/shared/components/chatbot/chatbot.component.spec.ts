import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { OllamaService } from '../../../core/services/ollama.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('ChatbotComponent', () => {
    let component: ChatbotComponent;
    let fixture: ComponentFixture<ChatbotComponent>;
    let mockOllamaService: any;
    let mockAuthService: any;

    beforeEach(async () => {
        mockOllamaService = {
            chat: jasmine.createSpy('chat').and.returnValue(of('Hello from AI'))
        };

        mockAuthService = {
            isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
            currentUser: jasmine.createSpy('currentUser').and.returnValue(signal({ role: 'JOB_SEEKER' })())
        };

        await TestBed.configureTestingModule({
            imports: [ChatbotComponent],
            providers: [
                { provide: OllamaService, useValue: mockOllamaService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChatbotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle chat visibility', () => {
        expect(component.isOpen()).toBeFalse();
        component.toggleChat();
        expect(component.isOpen()).toBeTrue();
        component.toggleChat();
        expect(component.isOpen()).toBeFalse();
    });

    it('should send a message and receive a response', async () => {
        component.userInput.set('Hello');
        await component.sendMessage();

        expect(mockOllamaService.chat).toHaveBeenCalled();
        expect(component.messages().length).toBeGreaterThan(1);
        expect(component.messages()[component.messages().length - 1].content).toBe('Hello from AI');
    });
});
