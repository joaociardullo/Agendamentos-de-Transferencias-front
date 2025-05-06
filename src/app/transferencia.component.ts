import { Component, OnInit } from '@angular/core';
import { TransferenciaService } from './transferencia.service';
import { Transferencia } from './transferencia.model';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class TransferenciaComponent implements OnInit {
  transferencias: Transferencia[] = [];
  novaTransferencia: Transferencia = {
    contaOrigem: '',
    contaDestino: '',
    valor: 0,
    taxa: 0,
    dataAgendamento: '',
    dataTransferencia: ''
  };
  editandoId: number | null = null;
  contaFiltro: string = '';
  idFiltro: number | null = null;

  constructor(private service: TransferenciaService) {}

  ngOnInit(): void {
    this.carregarTransferencias();
  }

  carregarTransferencias(): void {
    this.service.listar().subscribe({
      next: (data) => {
        this.transferencias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar transferências:', err);
        alert('Erro ao carregar transferências. Consulte o console para mais detalhes.');
      }
    });
  }

  salvar(): void {
    if (this.editandoId) {
      this.service.atualizar(this.editandoId, this.novaTransferencia).subscribe({
        next: () => {
          this.resetarFormulario();
          this.carregarTransferencias();
          alert('Transferência atualizada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar transferência:', err);
          alert('Erro ao atualizar transferência. Consulte o console para mais detalhes.');
        }
      });
    } else {
      this.service.criar(this.novaTransferencia).subscribe({
        next: () => {
          this.resetarFormulario();
          this.carregarTransferencias();
          alert('Transferência cadastrada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar transferência:', err);
          alert('Erro ao criar transferência. Consulte o console para mais detalhes.');
        }
      });
    }
  }


  deletar(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta transferência?')) {
      this.service.deletar(id).subscribe({
        next: () => {
          this.carregarTransferencias();
          alert('Transferência excluída com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir transferência:', err);
          alert('Erro ao excluir transferência. Consulte o console para mais detalhes.');
        }
      });
    }
  }

  resetarFormulario(): void {
    this.novaTransferencia = {
      contaOrigem: '',
      contaDestino: '',
      valor: 0,
      taxa: 0,
      dataAgendamento: '',
      dataTransferencia: ''
    };
    this.editandoId = null;
  }

  atualizarCampo(transferencia: Transferencia, campo: string, event: any): void {
    const novoValor = event.target.innerText.trim();
    
    if (campo === 'valor' || campo === 'taxa') {
      // Remove caracteres não numéricos e converte para número
      const valorNumerico = parseFloat(novoValor.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(valorNumerico)) {
        event.target.innerText = transferencia[campo];
        return;
      }
      transferencia[campo] = valorNumerico;
    }

    if (transferencia.id) {
      this.service.atualizar(transferencia.id, transferencia).subscribe({
        next: () => console.log(`Campo ${campo} atualizado com sucesso.`),
        error: (err) => {
          console.error(`Erro ao atualizar campo ${campo}:`, err);
          alert(`Erro ao atualizar campo ${campo}. Consulte o console para mais detalhes.`);
        }
      });
    }
  }

  buscarPorConta(): void {
    if (!this.contaFiltro.trim()) {
      this.carregarTransferencias();
      return;
    }

    this.service.buscarPorConta(this.contaFiltro).subscribe({
      next: (data) => {
        this.transferencias = data;
      },
      error: (err) => {
        console.error('Erro ao buscar por conta:', err);
        alert('Erro ao buscar por conta. Consulte o console para mais detalhes.');
      }
    });
  }


  limparFiltros(): void {
    this.contaFiltro = '';
    this.idFiltro = null;
    this.carregarTransferencias();
  }
}