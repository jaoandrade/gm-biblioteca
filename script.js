// Configuração do Supabase
const SUPABASE_URL = 'https://njmmirrzejrdoinzuynt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbW1pcnJ6ZWpyZG9pbnp1eW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTY4NDYsImV4cCI6MjA3NTU3Mjg0Nn0.bKIXGJiTHiGUGjRZgZtTnhsk8XUxbjWyhyyxPzydlHI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estado global da aplicação
let currentTab = 'livros';
let currentEditId = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    // Configurar data de devolução padrão (30 dias a partir de hoje)
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 30);
    document.getElementById('dataDevolucaoPrevista').value = futureDate.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Navegação entre abas principais
    document.querySelectorAll('.nav-tab:not(.dropdown-btn)').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            if (tabName) {
                switchTab(tabName);
            }
        });
    });

    // Configurar dropdown "Outros"
    setupOutrosDropdown();

    // Formulários
    setupFormListeners();
    
    // Busca em tempo real
    setupSearchListeners();
}

function setupOutrosDropdown() {
    const outrosBtn = document.getElementById('outrosBtn');
    const outrosDropdown = document.getElementById('outrosDropdown');
    const outrosChevron = document.getElementById('outrosChevron');
    
    if (!outrosBtn || !outrosDropdown || !outrosChevron) {
        console.error('Elementos do dropdown "Outros" não encontrados');
        return;
    }

    // Toggle do dropdown ao clicar no botão
    outrosBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleOutrosDropdown();
    });

    // Event listeners para os itens do dropdown
    const dropdownItems = outrosDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            if (tabName) {
                switchTab(tabName);
                closeOutrosDropdown();
            }
        });
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!outrosBtn.contains(e.target) && !outrosDropdown.contains(e.target)) {
            closeOutrosDropdown();
        }
    });

    // Fechar dropdown ao pressionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeOutrosDropdown();
        }
    });

    // Reposicionar dropdown ao redimensionar a janela
    window.addEventListener('resize', function() {
        const outrosDropdown = document.getElementById('outrosDropdown');
        if (outrosDropdown.classList.contains('show')) {
            // Fechar e reabrir para recalcular posição
            closeOutrosDropdown();
            setTimeout(() => {
                openOutrosDropdown();
            }, 50);
        }
    });
}

function toggleOutrosDropdown() {
    const outrosDropdown = document.getElementById('outrosDropdown');
    const outrosChevron = document.getElementById('outrosChevron');
    
    if (outrosDropdown.classList.contains('show')) {
        closeOutrosDropdown();
    } else {
        openOutrosDropdown();
    }
}

function openOutrosDropdown() {
    const outrosBtn = document.getElementById('outrosBtn');
    const outrosDropdown = document.getElementById('outrosDropdown');
    const outrosChevron = document.getElementById('outrosChevron');
    
    if (!outrosBtn || !outrosDropdown || !outrosChevron) {
        console.error('Elementos do dropdown não encontrados');
        return;
    }
    
    // Calcular posição do botão
    const btnRect = outrosBtn.getBoundingClientRect();
    
    // Posicionar o dropdown abaixo do botão
    outrosDropdown.style.position = 'fixed';
    outrosDropdown.style.top = (btnRect.bottom + 5) + 'px';
    outrosDropdown.style.left = btnRect.left + 'px';
    outrosDropdown.style.zIndex = '9999';
    
    // Mostrar o dropdown
    outrosDropdown.classList.add('show');
    outrosChevron.style.transform = 'rotate(180deg)';
    
    // Verificar se o dropdown sai da tela e ajustar se necessário
    setTimeout(() => {
        const dropdownRect = outrosDropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Ajustar horizontalmente se sair da tela
        if (dropdownRect.right > viewportWidth) {
            outrosDropdown.style.left = (viewportWidth - dropdownRect.width - 10) + 'px';
        }
        
        // Ajustar verticalmente se sair da tela
        if (dropdownRect.bottom > viewportHeight) {
            outrosDropdown.style.top = (btnRect.top - dropdownRect.height - 5) + 'px';
        }
    }, 10);
}

function closeOutrosDropdown() {
    const outrosDropdown = document.getElementById('outrosDropdown');
    const outrosChevron = document.getElementById('outrosChevron');
    
    outrosDropdown.classList.remove('show');
    outrosChevron.style.transform = 'rotate(0deg)';
    
    // Limpar estilos inline após a animação
    setTimeout(() => {
        outrosDropdown.style.position = '';
        outrosDropdown.style.top = '';
        outrosDropdown.style.left = '';
        outrosDropdown.style.zIndex = '';
    }, 300);
}

function setupFormListeners() {
    // Formulário de livros
    document.getElementById('livroForm').addEventListener('submit', handleLivroSubmit);
    
    // Formulário de utentes
    document.getElementById('utenteForm').addEventListener('submit', handleUtenteSubmit);
    
    // Formulário de requisições
    document.getElementById('requisicaoForm').addEventListener('submit', handleRequisicaoSubmit);
    
    // Formulários das entidades auxiliares
    document.getElementById('editoraForm').addEventListener('submit', handleEditoraSubmit);
    document.getElementById('codigoPostalForm').addEventListener('submit', handleCodigoPostalSubmit);
    document.getElementById('idiomaForm').addEventListener('submit', handleIdiomaSubmit);
    document.getElementById('generoForm').addEventListener('submit', handleGeneroSubmit);
    document.getElementById('autorForm').addEventListener('submit', handleAutorSubmit);
    
    // Formulário de devolução
    document.getElementById('devolucaoForm').addEventListener('submit', handleDevolucaoSubmit);
    
    // Formulário de aviso de atraso
    document.getElementById('avisoAtrasoForm').addEventListener('submit', handleAvisoAtrasoSubmit);
}

function setupSearchListeners() {
    // Busca em tempo real para livros
    document.getElementById('searchLivros').addEventListener('input', debounce(searchLivros, 300));
    document.getElementById('searchUtentes').addEventListener('input', debounce(searchUtentes, 300));
    document.getElementById('searchEmprestimos').addEventListener('input', debounce(searchEmprestimos, 300));
    document.getElementById('searchEditoras').addEventListener('input', debounce(searchEditoras, 300));
    document.getElementById('searchCodigosPostais').addEventListener('input', debounce(searchCodigosPostais, 300));
    document.getElementById('searchIdiomas').addEventListener('input', debounce(searchIdiomas, 300));
    document.getElementById('searchGeneros').addEventListener('input', debounce(searchGeneros, 300));
    document.getElementById('searchAutores').addEventListener('input', debounce(searchAutores, 300));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funções de navegação
function switchTab(tabName) {
    // Remover active de todas as abas
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar active na aba selecionada
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
        currentTab = tabName;
        
        // Carregar dados específicos da aba
        loadTabData(tabName);
    } else {
        console.error(`Aba com ID '${tabName}' não encontrada`);
    }
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'livros':
            loadLivros();
            break;
        case 'utentes':
            loadUtentes();
            break;
        case 'emprestimos':
            loadEmprestimos();
            break;
        case 'editoras':
            loadEditoras();
            break;
        case 'codigos-postais':
            loadCodigosPostais();
            break;
        case 'idiomas':
            loadIdiomas();
            break;
        case 'generos':
            loadGeneros();
            break;
        case 'autores':
            loadAutores();
            break;
    }
}

// Carregar dados iniciais
async function loadInitialData() {
    try {
        await Promise.all([
            loadAutores(),
            loadEditoras(),
            loadGeneros(),
            loadIdiomas(),
            loadCodigosPostais()
        ]);
        
        // Carregar dados da aba ativa
        loadTabData(currentTab);
        
        // Popular dropdowns
        populateDropdowns();
        
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showNotification('Erro ao carregar dados iniciais', 'error');
    }
}

async function populateDropdowns() {
    try {
        // Popular dropdowns de livros
        await populateDropdown('livroAutor', 'autores', 'nome');
        await populateDropdown('livroEditora', 'editoras', 'nome');
        await populateDropdown('livroGenero', 'generos', 'nome');
        await populateDropdown('livroIdioma', 'idiomas', 'nome');
        
        // Popular dropdowns de utentes
        await populateDropdown('utenteCodigoPostal', 'codigos_postais', 'codigo', 'localidade');
        
        // Popular dropdowns de editoras
        await populateDropdown('editoraCodigoPostal', 'codigos_postais', 'codigo', 'localidade');
        
    } catch (error) {
        console.error('Erro ao popular dropdowns:', error);
    }
}

async function populateDropdown(selectId, table, field1, field2 = null) {
    try {
        console.log(`Populando dropdown ${selectId} com dados da tabela ${table}`);
        
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order(field1);
            
        if (error) {
            console.error(`Erro ao buscar dados da tabela ${table}:`, error);
            throw error;
        }
        
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Elemento select com ID '${selectId}' não encontrado`);
            return;
        }
        
        console.log(`Encontrados ${data.length} registros na tabela ${table}`);
        
        // Limpar opções existentes (exceto a primeira)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = field2 ? `${item[field1]} - ${item[field2]}` : item[field1];
            select.appendChild(option);
        });
        
        console.log(`Dropdown ${selectId} populado com sucesso`);
        
    } catch (error) {
        console.error(`Erro ao popular dropdown ${selectId}:`, error);
    }
}

// Funções de CRUD para Livros
async function loadLivros() {
    try {
        showLoading('livrosTableBody');
        
        // Primeiro, corrigir status dos livros baseado nos empréstimos
        await corrigirStatusLivrosGeral();
        
        const { data, error } = await supabase
            .from('livros_completos')
            .select('*')
            .order('titulo');
            
        if (error) throw error;
        
        displayLivros(data || []);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showNotification('Erro ao carregar livros', 'error');
        showEmptyState('livrosTableBody', 'Erro ao carregar livros');
    }
}

function displayLivros(livros) {
    const tbody = document.getElementById('livrosTableBody');
    tbody.innerHTML = '';
    
    if (livros.length === 0) {
        showEmptyState('livrosTableBody', 'Nenhum livro encontrado');
        return;
    }
    
    livros.forEach(livro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${livro.isbn || '-'}</td>
            <td>${livro.titulo || '-'}</td>
            <td>${livro.autor || '-'}</td>
            <td>${livro.editora || '-'}</td>
            <td>${livro.genero || '-'}</td>
            <td>${livro.idioma || '-'}</td>
            <td>${livro.ano || '-'}</td>
            <td><span class="status-badge status-${livro.status || 'disponivel'}">${livro.status || 'Disponível'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editLivro(${livro.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLivro(${livro.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleLivroSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validar dados
        if (!data.titulo || !data.isbn || !data.autor_id || !data.editora_id || !data.genero_id || !data.idioma_id || !data.ano) {
            showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Converter ano para número
        data.ano = parseInt(data.ano);
        
        let result;
        if (data.id) {
            // Atualizar livro existente
            result = await supabase
                .from('livros')
                .update({
                    titulo: data.titulo,
                    isbn: data.isbn,
                    autor_id: parseInt(data.autor_id),
                    editora_id: parseInt(data.editora_id),
                    genero_id: parseInt(data.genero_id),
                    idioma_id: parseInt(data.idioma_id),
                    ano: data.ano,
                    status: data.status || 'disponivel'
                })
                .eq('id', data.id);
        } else {
            // Criar novo livro
            result = await supabase
                .from('livros')
                .insert([{
                    titulo: data.titulo,
                    isbn: data.isbn,
                    autor_id: parseInt(data.autor_id),
                    editora_id: parseInt(data.editora_id),
                    genero_id: parseInt(data.genero_id),
                    idioma_id: parseInt(data.idioma_id),
                    ano: data.ano,
                    status: data.status || 'disponivel'
                }]);
        }
        
        if (result.error) throw result.error;
        
        closeModal('livroModal');
        showNotification(data.id ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!', 'success');
        loadLivros();
        
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
        showNotification('Erro ao salvar livro', 'error');
    }
}

async function editLivro(id) {
    try {
        currentEditId = id;
        
        // Buscar dados do livro
        const { data: livro, error } = await supabase
            .from('livros')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        console.log('Dados do livro para edição:', livro);
        
        // Preencher o formulário com os dados existentes
        document.getElementById('livroId').value = livro.id;
        document.getElementById('livroTitulo').value = livro.titulo || '';
        document.getElementById('livroIsbn').value = livro.isbn || '';
        document.getElementById('livroAutor').value = livro.autor_id || '';
        document.getElementById('livroEditora').value = livro.editora_id || '';
        document.getElementById('livroGenero').value = livro.genero_id || '';
        document.getElementById('livroIdioma').value = livro.idioma_id || '';
        document.getElementById('livroAno').value = livro.ano || '';
        document.getElementById('livroDescricao').value = livro.descricao || '';
        document.getElementById('livroStatus').value = livro.status || 'disponivel';
        
        // Atualizar título do modal
        const modalTitle = document.querySelector('#livroModal .modal-header h3');
        modalTitle.textContent = 'Editar Livro';
        
        openModal('livroModal');
        
    } catch (error) {
        console.error('Erro ao carregar dados do livro:', error);
        showNotification('Erro ao carregar dados do livro', 'error');
    }
}

async function deleteLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;
    
    try {
        const { error } = await supabase
            .from('livros')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Livro excluído com sucesso!', 'success');
        loadLivros();
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        showNotification('Erro ao excluir livro', 'error');
    }
}

function searchLivros() {
    const searchTerm = document.getElementById('searchLivros').value.toLowerCase();
    
    // Implementar busca local por enquanto
    const rows = document.querySelectorAll('#livrosTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Funções de CRUD para Utentes
async function loadUtentes() {
    try {
        showLoading('utentesTableBody');
        
        const { data, error } = await supabase
            .from('utentes')
            .select(`
                *,
                codigos_postais (
                    codigo,
                    localidade
                )
            `)
            .order('nome');
            
        if (error) throw error;
        
        displayUtentes(data || []);
    } catch (error) {
        console.error('Erro ao carregar utentes:', error);
        showNotification('Erro ao carregar utentes', 'error');
        showEmptyState('utentesTableBody', 'Erro ao carregar utentes');
    }
}

function displayUtentes(utentes) {
    const tbody = document.getElementById('utentesTableBody');
    tbody.innerHTML = '';
    
    if (utentes.length === 0) {
        showEmptyState('utentesTableBody', 'Nenhum utente encontrado');
        return;
    }
    
    utentes.forEach(utente => {
        const row = document.createElement('tr');
        
        // Formatar código postal
        let codigoPostalDisplay = '-';
        if (utente.codigos_postais) {
            codigoPostalDisplay = `${utente.codigos_postais.codigo} - ${utente.codigos_postais.localidade}`;
        } else if (utente.ut_codpostal) {
            codigoPostalDisplay = `ID: ${utente.ut_codpostal}`;
        }
        
        row.innerHTML = `
            <td>${utente.numero_processo || '-'}</td>
            <td>${utente.nome || '-'}</td>
            <td>${utente.turma || '-'}</td>
            <td>${utente.ano || '-'}</td>
            <td>${utente.email || '-'}</td>
            <td>${codigoPostalDisplay}</td>
            <td>${utente.ut_rua || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editUtente(${utente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUtente(${utente.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleUtenteSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('Dados do formulário:', data);
        
        // Validar dados obrigatórios
        if (!data.nome || !data.numero_processo || !data.turma || !data.ano) {
            showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Validar email apenas se fornecido
        if (data.email && data.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Por favor, insira um email válido', 'error');
                return;
            }
        }
        
        // Preparar dados para inserção/atualização
        const utenteData = {
            nome: data.nome.trim(),
            numero_processo: data.numero_processo.trim(),
            turma: data.turma.trim(),
            ano: data.ano.trim(),
            email: data.email.trim(),
            ut_codpostal: data.ut_codpostal ? parseInt(data.ut_codpostal) : null,
            ut_rua: data.ut_rua ? data.ut_rua.trim() : null,
            senha: data.senha ? data.senha.trim() : null
        };
        
        console.log('Dados preparados:', utenteData);
        
        let result;
        if (data.id) {
            // Atualizar utente existente
            console.log('Atualizando utente ID:', data.id);
            result = await supabase
                .from('utentes')
                .update(utenteData)
                .eq('id', data.id);
        } else {
            // Criar novo utente
            console.log('Criando novo utente');
            result = await supabase
                .from('utentes')
                .insert([utenteData]);
        }
        
        console.log('Resultado da operação:', result);
        
        if (result.error) {
            console.error('Erro detalhado:', result.error);
            throw result.error;
        }
        
        closeModal('utenteModal');
        showNotification(data.id ? 'Utente atualizado com sucesso!' : 'Utente criado com sucesso!', 'success');
        loadUtentes();
        
    } catch (error) {
        console.error('Erro ao salvar utente:', error);
        
        // Mostrar mensagem de erro mais específica
        let errorMessage = 'Erro ao salvar utente';
        
        if (error.message) {
            if (error.message.includes('duplicate key')) {
                errorMessage = 'Já existe um utente com este número de processo ou email';
            } else if (error.message.includes('violates')) {
                errorMessage = 'Dados inválidos. Verifique os campos preenchidos';
            } else if (error.message.includes('permission')) {
                errorMessage = 'Sem permissão para salvar utente';
            } else {
                errorMessage = `Erro: ${error.message}`;
            }
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function editUtente(id) {
    try {
        currentEditId = id;
        
        // Buscar dados do utente
        const { data: utente, error } = await supabase
            .from('utentes')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        console.log('Dados do utente para edição:', utente);
        
        // Preencher o formulário com os dados existentes
        document.getElementById('utenteId').value = utente.id;
        document.getElementById('utenteNome').value = utente.nome || '';
        document.getElementById('utenteNumeroProcesso').value = utente.numero_processo || '';
        document.getElementById('utenteTurma').value = utente.turma || '';
        document.getElementById('utenteAno').value = utente.ano || '';
        document.getElementById('utenteEmail').value = utente.email || '';
        document.getElementById('utenteCodigoPostal').value = utente.ut_codpostal || '';
        document.getElementById('utenteRua').value = utente.ut_rua || '';
        document.getElementById('utenteSenha').value = utente.senha || '';
        
        // Atualizar título do modal
        const modalTitle = document.querySelector('#utenteModal .modal-header h3');
        modalTitle.textContent = 'Editar Utente';
        
        openModal('utenteModal');
        
    } catch (error) {
        console.error('Erro ao carregar dados do utente:', error);
        showNotification('Erro ao carregar dados do utente', 'error');
    }
}

async function deleteUtente(id) {
    if (!confirm('Tem certeza que deseja excluir este utente?')) return;
    
    try {
        const { error } = await supabase
            .from('utentes')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Utente excluído com sucesso!', 'success');
        loadUtentes();
    } catch (error) {
        console.error('Erro ao excluir utente:', error);
        showNotification('Erro ao excluir utente', 'error');
    }
}

function searchUtentes() {
    const searchTerm = document.getElementById('searchUtentes').value.toLowerCase();
    const rows = document.querySelectorAll('#utentesTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Funções para Requisições
async function handleRequisicaoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validar dados
        if (!data.numeroProcesso || !data.email || !data.livroId || !data.codigoPostal || !data.dataDevolucaoPrevista) {
            showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Verificar se o utente existe
        const { data: utente, error: utenteError } = await supabase
            .from('utentes')
            .select('id')
            .eq('numero_processo', data.numeroProcesso)
            .single();
            
        if (utenteError || !utente) {
            showNotification('Utente não encontrado. Verifique o número de processo.', 'error');
            return;
        }
        
        // Verificar se o livro está disponível
        const { data: livro, error: livroError } = await supabase
            .from('livros')
            .select('status')
            .eq('id', data.livroId)
            .single();
            
        if (livroError || !livro) {
            showNotification('Livro não encontrado.', 'error');
            return;
        }
        
        if (livro.status !== 'disponivel') {
            showNotification('Livro não está disponível para empréstimo.', 'error');
            return;
        }
        
        // Criar requisição
        const { error } = await supabase
            .from('requisicoes')
            .insert([{
                numero_processo: data.numeroProcesso,
                codigo_postal: data.codigoPostal,
                email: data.email,
                livro_id: parseInt(data.livroId),
                data_requisicao: new Date().toISOString().split('T')[0],
                data_devolucao_prevista: data.dataDevolucaoPrevista,
                status: 'ativo',
                observacoes: data.observacoes || null
            }]);
            
        if (error) throw error;
        
        // Atualizar status do livro
        await supabase
            .from('livros')
            .update({ status: 'emprestado' })
            .eq('id', data.livroId);
        
        showNotification('Requisição criada com sucesso!', 'success');
        e.target.reset();
        
        // Resetar data de devolução
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + 30);
        document.getElementById('dataDevolucaoPrevista').value = futureDate.toISOString().split('T')[0];
        
    } catch (error) {
        console.error('Erro ao criar requisição:', error);
        showNotification('Erro ao criar requisição', 'error');
    }
}

// Funções para Empréstimos
async function loadEmprestimos() {
    try {
        console.log('=== LOAD EMPRESTIMOS INICIADO ===');
        showLoading('emprestimosTableBody');
        
        // Tentar primeiro com a view completa, se falhar usar join manual
        let data, error;
        
        try {
            console.log('Tentando carregar com view requisicoes_completas...');
            const result = await supabase
                .from('requisicoes_completas')
                .select('*')
                .order('data_requisicao', { ascending: false });
            data = result.data;
            error = result.error;
            console.log('View carregada com sucesso:', data);
        } catch (viewError) {
            console.log('View requisicoes_completas não existe, usando join manual');
            console.log('Erro da view:', viewError);
            
            // Fazer join manual
            const result = await supabase
                .from('requisicoes')
                .select(`
                    *,
                    utentes!inner(nome, email),
                    livros!inner(titulo, isbn)
                `)
                .order('data_requisicao', { ascending: false });
            
            data = result.data;
            error = result.error;
            
            console.log('Join manual executado:', data);
            
            // Transformar dados para formato esperado
            if (data) {
                data = data.map(item => ({
                    ...item,
                    utente_nome: item.utentes?.nome || '-',
                    livro_titulo: item.livros?.titulo || '-',
                    email: item.utentes?.email || '-'
                }));
                console.log('Dados transformados:', data);
            }
        }
            
        if (error) {
            console.error('Erro ao carregar dados:', error);
            throw error;
        }
        
        console.log('Dados finais carregados:', data);
        console.log('Quantidade de empréstimos:', data ? data.length : 0);
        
        // Corrigir status dos livros baseado nos empréstimos
        if (data && data.length > 0) {
            await corrigirStatusLivros(data);
        }
        
        displayEmprestimos(data || []);
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        showNotification('Erro ao carregar empréstimos: ' + error.message, 'error');
        showEmptyState('emprestimosTableBody', 'Erro ao carregar empréstimos');
    }
}

async function corrigirStatusLivros(emprestimos) {
    try {
        // Obter IDs dos livros com empréstimos ativos (qualquer status que não seja devolvido/cancelado)
        const livrosEmprestados = emprestimos
            .filter(emp => temAcoes(emp.status)) // Usar a função temAcoes para consistência
            .map(emp => emp.livro_id);
        
        console.log('Livros emprestados encontrados:', livrosEmprestados);
        
        if (livrosEmprestados.length > 0) {
            // Atualizar livros emprestados
            const { error: empError } = await supabase
                .from('livros')
                .update({ status: 'emprestado' })
                .in('id', livrosEmprestados);
            
            if (empError) {
                console.error('Erro ao atualizar livros emprestados:', empError);
            } else {
                console.log(`${livrosEmprestados.length} livros marcados como emprestados`);
            }
        }
        
        // Obter todos os livros para atualizar os não emprestados
        const { data: todosLivros } = await supabase
            .from('livros')
            .select('id');
        
        if (todosLivros) {
            const livrosDisponiveis = todosLivros
                .filter(livro => !livrosEmprestados.includes(livro.id))
                .map(livro => livro.id);
            
            if (livrosDisponiveis.length > 0) {
                // Atualizar livros disponíveis
                const { error: dispError } = await supabase
                    .from('livros')
                    .update({ status: 'disponivel' })
                    .in('id', livrosDisponiveis);
                
                if (dispError) {
                    console.error('Erro ao atualizar livros disponíveis:', dispError);
                } else {
                    console.log(`${livrosDisponiveis.length} livros marcados como disponíveis`);
                }
            }
        }
        
        console.log('Status dos livros corrigido automaticamente');
    } catch (error) {
        console.error('Erro ao corrigir status dos livros:', error);
    }
}

// Função para corrigir status de todos os livros baseado nos empréstimos
async function corrigirStatusLivrosGeral() {
    try {
        console.log('Corrigindo status de todos os livros...');
        
        // Carregar todos os empréstimos
        const { data: emprestimos, error: empError } = await supabase
            .from('requisicoes')
            .select('livro_id, status');
        
        if (empError) throw empError;
        
        // Obter IDs dos livros com empréstimos ativos
        const livrosEmprestados = emprestimos
            .filter(emp => temAcoes(emp.status))
            .map(emp => emp.livro_id);
        
        console.log('Livros emprestados encontrados:', livrosEmprestados);
        console.log('Status dos empréstimos:', emprestimos.map(emp => ({ livro_id: emp.livro_id, status: emp.status })));
        
        // Obter todos os livros
        const { data: todosLivros, error: livError } = await supabase
            .from('livros')
            .select('id');
        
        if (livError) throw livError;
        
        // Separar livros emprestados e disponíveis
        const livrosDisponiveis = todosLivros
            .filter(livro => !livrosEmprestados.includes(livro.id))
            .map(livro => livro.id);
        
        // Atualizar livros emprestados
        if (livrosEmprestados.length > 0) {
            const { error: empUpdateError } = await supabase
                .from('livros')
                .update({ status: 'emprestado' })
                .in('id', livrosEmprestados);
            
            if (empUpdateError) {
                console.error('Erro ao atualizar livros emprestados:', empUpdateError);
            } else {
                console.log(`${livrosEmprestados.length} livros marcados como emprestados`);
            }
        }
        
        // Atualizar livros disponíveis
        if (livrosDisponiveis.length > 0) {
            const { error: dispUpdateError } = await supabase
                .from('livros')
                .update({ status: 'disponivel' })
                .in('id', livrosDisponiveis);
            
            if (dispUpdateError) {
                console.error('Erro ao atualizar livros disponíveis:', dispUpdateError);
            } else {
                console.log(`${livrosDisponiveis.length} livros marcados como disponíveis`);
            }
        }
        
        console.log('Status de todos os livros corrigido');
    } catch (error) {
        console.error('Erro ao corrigir status geral dos livros:', error);
    }
}

// Função para determinar se tem ações
function temAcoes(status) {
    // Se não tem status ou é diferente de devolvido/cancelado, tem ações
    return !status || (status !== 'devolvido' && status !== 'cancelado' && status !== 'devolvida' && status !== 'cancelada');
}

function displayEmprestimos(emprestimos) {
    const tbody = document.getElementById('emprestimosTableBody');
    tbody.innerHTML = '';
    
    console.log('=== DISPLAY EMPRESTIMOS ===');
    console.log('Empréstimos recebidos:', emprestimos);
    console.log('Quantidade:', emprestimos.length);
    console.log('Tbody encontrado:', tbody);
    
    if (emprestimos.length === 0) {
        console.log('Nenhum empréstimo encontrado, mostrando estado vazio');
        showEmptyState('emprestimosTableBody', 'Nenhum empréstimo encontrado');
        return;
    }
    
    emprestimos.forEach(emprestimo => {
        const row = document.createElement('tr');
        
        // Verificar se está atrasado
        const hoje = new Date();
        const dataPrevista = new Date(emprestimo.data_devolucao_prevista);
        const isAtrasado = hoje > dataPrevista && temAcoes(emprestimo.status);
        
        if (isAtrasado) {
            row.classList.add('overdue');
        }
        
        // Calcular dias de atraso
        const diasAtraso = isAtrasado ? Math.ceil((hoje - dataPrevista) / (1000 * 60 * 60 * 24)) : 0;
        
        // Debug: mostrar dados do empréstimo
        console.log('Empréstimo:', emprestimo);
        console.log('Status:', emprestimo.status);
        console.log('ID:', emprestimo.id);
        console.log('É atrasado:', isAtrasado);
        
        row.innerHTML = `
            <td>${emprestimo.numero_processo || '-'}</td>
            <td>${emprestimo.utente_nome || '-'}</td>
            <td>${emprestimo.livro_titulo || '-'}</td>
            <td>${formatDate(emprestimo.data_requisicao)}</td>
            <td>${formatDate(emprestimo.data_devolucao_prevista)}${isAtrasado ? ` <span class="overdue-days">(${diasAtraso} dias atrasado)</span>` : ''}</td>
            <td><span class="status-badge status-${emprestimo.status || 'ativo'}">${emprestimo.status || 'Ativo'}</span></td>
            <td>
                <div class="action-buttons">
                    ${temAcoes(emprestimo.status) ? `
                        <button class="btn btn-sm btn-success" onclick="devolverLivro(${emprestimo.id})" title="Devolver livro">
                            <i class="fas fa-check"></i> Devolver
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="cancelarEmprestimo(${emprestimo.id})" title="Cancelar empréstimo">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    ` : ''}
                    ${isAtrasado ? `
                        <button class="btn btn-sm btn-danger" onclick="enviarAvisoAtraso(${emprestimo.id})" title="Enviar aviso de atraso por email">
                            <i class="fas fa-envelope"></i> Aviso
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function devolverLivro(id) {
    document.getElementById('devolucaoRequisicaoId').value = id;
    openModal('devolucaoModal');
}

async function handleDevolucaoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const requisicaoId = data.requisicao_id;
        
        // Validar se o estado do livro foi selecionado
        if (!data.estado_livro) {
            showNotification('Por favor, selecione o estado do livro', 'error');
            return;
        }
        
        // Atualizar requisição - tentar diferentes status para contornar constraint
        let updateError = null;
        const statusOptions = ['devolvido', 'devolvida', 'returned'];
        
        for (const status of statusOptions) {
            const { error } = await supabase
                .from('requisicoes')
                .update({
                    status: status,
                    data_devolucao_efetiva: data.data_devolucao_efetiva || new Date().toISOString().split('T')[0],
                    observacoes: data.observacoes || null,
                    estado_livro: data.estado_livro
                })
                .eq('id', requisicaoId);
            
            if (!error) {
                updateError = null;
                break;
            } else {
                updateError = error;
                console.log(`Tentativa com status '${status}' falhou:`, error.message);
            }
        }
        
        if (updateError) throw updateError;
        
        // Buscar livro_id da requisição para atualizar status
        const { data: requisicao, error: reqError } = await supabase
            .from('requisicoes')
            .select('livro_id')
            .eq('id', requisicaoId)
            .single();
            
        if (reqError) throw reqError;
        
        // Atualizar status do livro
        const { error: livroError } = await supabase
            .from('livros')
            .update({ status: 'disponivel' })
            .eq('id', requisicao.livro_id);
        
        if (livroError) {
            console.error('Erro ao atualizar status do livro:', livroError);
            showNotification('Empréstimo devolvido, mas erro ao atualizar status do livro', 'warning');
        } else {
            console.log('Status do livro atualizado para disponível');
        }
        
        closeModal('devolucaoModal');
        showNotification('Livro devolvido com sucesso! Relatório de estado salvo.', 'success');
        
        // Recarregar ambas as abas para garantir consistência
        loadEmprestimos();
        
        // Se estivermos na aba livros, recarregar também
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab && activeTab.textContent.includes('Livros')) {
            loadLivros();
        }
        
    } catch (error) {
        console.error('Erro ao devolver livro:', error);
        showNotification('Erro ao devolver livro', 'error');
    }
}

async function cancelarEmprestimo(id) {
    if (!confirm('Tem certeza que deseja cancelar este empréstimo?')) return;
    
    try {
        // Buscar livro_id da requisição
        const { data: requisicao, error: reqError } = await supabase
            .from('requisicoes')
            .select('livro_id')
            .eq('id', id)
            .single();
            
        if (reqError) throw reqError;
        
        // Atualizar status da requisição
        const { error } = await supabase
            .from('requisicoes')
            .update({ status: 'cancelado' })
            .eq('id', id);
            
        if (error) throw error;
        
        // Atualizar status do livro
        await supabase
            .from('livros')
            .update({ status: 'disponivel' })
            .eq('id', requisicao.livro_id);
        
        showNotification('Empréstimo cancelado com sucesso!', 'success');
        loadEmprestimos();
        
    } catch (error) {
        console.error('Erro ao cancelar empréstimo:', error);
        showNotification('Erro ao cancelar empréstimo', 'error');
    }
}

async function enviarAvisoAtraso(id) {
    try {
        // Buscar dados da requisição
        const { data: requisicao, error } = await supabase
            .from('requisicoes_completas')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        // Calcular dias de atraso
        const hoje = new Date();
        const dataPrevista = new Date(requisicao.data_devolucao_prevista);
        const diasAtraso = Math.ceil((hoje - dataPrevista) / (1000 * 60 * 60 * 24));
        
        // Preencher o modal com os dados
        document.getElementById('avisoRequisicaoId').value = id;
        document.getElementById('emailUtente').value = requisicao.email || '';
        document.getElementById('nomeUtente').value = requisicao.utente_nome || '';
        document.getElementById('tituloLivro').value = requisicao.livro_titulo || '';
        document.getElementById('dataPrevista').value = formatDate(requisicao.data_devolucao_prevista);
        document.getElementById('diasAtraso').value = `${diasAtraso} dias`;
        
        // Mensagem padrão
        const mensagemPadrao = `Caro(a) ${requisicao.utente_nome},

Informamos que o livro "${requisicao.livro_titulo}" que requisitou deveria ter sido devolvido em ${formatDate(requisicao.data_devolucao_prevista)}.

O livro está em atraso há ${diasAtraso} dias.

Por favor, proceda à devolução do livro o mais rapidamente possível para evitar sanções.

Atenciosamente,
Equipa da Biblioteca Escolar
Escola Ginestal Machado`;

        document.getElementById('mensagemEmail').value = mensagemPadrao;
        
        openModal('avisoAtrasoModal');
        
    } catch (error) {
        console.error('Erro ao carregar dados para aviso:', error);
        showNotification('Erro ao carregar dados do empréstimo', 'error');
    }
}

async function handleAvisoAtrasoSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simular envio de email (em produção, integrar com serviço de email)
        console.log('Enviando email de aviso:', {
            para: data.email,
            assunto: data.assunto,
            mensagem: data.mensagem
        });
        
        // Aqui você integraria com um serviço de email real como:
        // - SendGrid
        // - Mailgun
        // - AWS SES
        // - Nodemailer
        
        closeModal('avisoAtrasoModal');
        showNotification('Aviso de atraso enviado por email com sucesso!', 'success');
        
        // Opcional: Registrar o envio do aviso na base de dados
        await supabase
            .from('avisos_atraso')
            .insert([{
                requisicao_id: data.requisicao_id,
                email_enviado: data.email,
                data_envio: new Date().toISOString(),
                assunto: data.assunto,
                mensagem: data.mensagem
            }]);
        
    } catch (error) {
        console.error('Erro ao enviar aviso:', error);
        showNotification('Erro ao enviar aviso por email', 'error');
    }
}

function searchEmprestimos() {
    const searchTerm = document.getElementById('searchEmprestimos').value.toLowerCase();
    const rows = document.querySelectorAll('#emprestimosTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterEmprestimos() {
    const status = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#emprestimosTableBody tr');
    
    rows.forEach(row => {
        if (!status) {
            row.style.display = '';
        } else {
            const statusCell = row.querySelector('.status-badge');
            const rowStatus = statusCell ? statusCell.textContent.toLowerCase() : '';
            row.style.display = rowStatus.includes(status) ? '' : 'none';
        }
    });
}

// Funções CRUD para entidades auxiliares
async function loadAutores() {
    try {
        showLoading('autoresTableBody');
        
        const { data, error } = await supabase
            .from('autores')
            .select('*')
            .order('nome');
            
        if (error) throw error;
        
        displayAutores(data || []);
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
        showNotification('Erro ao carregar autores', 'error');
        showEmptyState('autoresTableBody', 'Erro ao carregar autores');
    }
}

function displayAutores(autores) {
    const tbody = document.getElementById('autoresTableBody');
    tbody.innerHTML = '';
    
    if (autores.length === 0) {
        showEmptyState('autoresTableBody', 'Nenhum autor encontrado');
        return;
    }
    
    autores.forEach(autor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${autor.nome || '-'}</td>
            <td>${autor.descricao || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editAutor(${autor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAutor(${autor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editAutor(id) {
    const fieldMappings = [
        { fieldId: 'autorId', dbField: 'id' },
        { fieldId: 'autorNome', dbField: 'nome' },
        { fieldId: 'autorDescricao', dbField: 'descricao' }
    ];
    editEntity(id, 'autores', 'autorModal', fieldMappings);
}

async function deleteAutor(id) {
    if (!confirm('Tem certeza que deseja excluir este autor?')) return;
    
    try {
        const { error } = await supabase
            .from('autores')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Autor excluído com sucesso!', 'success');
        loadAutores();
    } catch (error) {
        console.error('Erro ao excluir autor:', error);
        showNotification('Erro ao excluir autor', 'error');
    }
}

async function loadEditoras() {
    try {
        showLoading('editorasTableBody');
        
        const { data, error } = await supabase
            .from('editoras')
            .select(`
                *,
                codigos_postais (
                    codigo,
                    localidade
                )
            `)
            .order('nome');
            
        if (error) throw error;
        
        displayEditoras(data || []);
    } catch (error) {
        console.error('Erro ao carregar editoras:', error);
        showNotification('Erro ao carregar editoras', 'error');
        showEmptyState('editorasTableBody', 'Erro ao carregar editoras');
    }
}

function displayEditoras(editoras) {
    const tbody = document.getElementById('editorasTableBody');
    tbody.innerHTML = '';
    
    if (editoras.length === 0) {
        showEmptyState('editorasTableBody', 'Nenhuma editora encontrada');
        return;
    }
    
    editoras.forEach(editora => {
        const row = document.createElement('tr');
        
        // Formatar código postal
        let codigoPostalDisplay = '-';
        if (editora.codigos_postais) {
            codigoPostalDisplay = `${editora.codigos_postais.codigo} - ${editora.codigos_postais.localidade}`;
        } else if (editora.codigo_postal_id) {
            codigoPostalDisplay = `ID: ${editora.codigo_postal_id}`;
        }
        
        row.innerHTML = `
            <td>${editora.nome || '-'}</td>
            <td>${editora.descricao || '-'}</td>
            <td>${codigoPostalDisplay}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editEditora(${editora.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEditora(${editora.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editEditora(id) {
    const fieldMappings = [
        { fieldId: 'editoraId', dbField: 'id' },
        { fieldId: 'editoraNome', dbField: 'nome' },
        { fieldId: 'editoraDescricao', dbField: 'descricao' },
        { fieldId: 'editoraCodigoPostal', dbField: 'codigo_postal_id' }
    ];
    editEntity(id, 'editoras', 'editoraModal', fieldMappings);
}

async function deleteEditora(id) {
    if (!confirm('Tem certeza que deseja excluir esta editora?')) return;
    
    try {
        const { error } = await supabase
            .from('editoras')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Editora excluída com sucesso!', 'success');
        loadEditoras();
    } catch (error) {
        console.error('Erro ao excluir editora:', error);
        showNotification('Erro ao excluir editora', 'error');
    }
}

async function loadGeneros() {
    try {
        showLoading('generosTableBody');
        
        const { data, error } = await supabase
            .from('generos')
            .select('*')
            .order('nome');
            
        if (error) throw error;
        
        displayGeneros(data || []);
    } catch (error) {
        console.error('Erro ao carregar géneros:', error);
        showNotification('Erro ao carregar géneros', 'error');
        showEmptyState('generosTableBody', 'Erro ao carregar géneros');
    }
}

function displayGeneros(generos) {
    const tbody = document.getElementById('generosTableBody');
    tbody.innerHTML = '';
    
    if (generos.length === 0) {
        showEmptyState('generosTableBody', 'Nenhum género encontrado');
        return;
    }
    
    generos.forEach(genero => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${genero.nome || '-'}</td>
            <td>${genero.descricao || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editGenero(${genero.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGenero(${genero.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editGenero(id) {
    const fieldMappings = [
        { fieldId: 'generoId', dbField: 'id' },
        { fieldId: 'generoNome', dbField: 'nome' },
        { fieldId: 'generoDescricao', dbField: 'descricao' }
    ];
    editEntity(id, 'generos', 'generoModal', fieldMappings);
}

async function deleteGenero(id) {
    if (!confirm('Tem certeza que deseja excluir este género?')) return;
    
    try {
        const { error } = await supabase
            .from('generos')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Género excluído com sucesso!', 'success');
        loadGeneros();
    } catch (error) {
        console.error('Erro ao excluir género:', error);
        showNotification('Erro ao excluir género', 'error');
    }
}

async function loadIdiomas() {
    try {
        showLoading('idiomasTableBody');
        
        const { data, error } = await supabase
            .from('idiomas')
            .select('*')
            .order('nome');
            
        if (error) throw error;
        
        displayIdiomas(data || []);
    } catch (error) {
        console.error('Erro ao carregar idiomas:', error);
        showNotification('Erro ao carregar idiomas', 'error');
        showEmptyState('idiomasTableBody', 'Erro ao carregar idiomas');
    }
}

function displayIdiomas(idiomas) {
    const tbody = document.getElementById('idiomasTableBody');
    tbody.innerHTML = '';
    
    if (idiomas.length === 0) {
        showEmptyState('idiomasTableBody', 'Nenhum idioma encontrado');
        return;
    }
    
    idiomas.forEach(idioma => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idioma.nome || '-'}</td>
            <td>${idioma.codigo || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editIdioma(${idioma.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteIdioma(${idioma.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editIdioma(id) {
    const fieldMappings = [
        { fieldId: 'idiomaId', dbField: 'id' },
        { fieldId: 'idiomaNome', dbField: 'nome' },
        { fieldId: 'idiomaCodigo', dbField: 'codigo' }
    ];
    editEntity(id, 'idiomas', 'idiomaModal', fieldMappings);
}

async function deleteIdioma(id) {
    if (!confirm('Tem certeza que deseja excluir este idioma?')) return;
    
    try {
        const { error } = await supabase
            .from('idiomas')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Idioma excluído com sucesso!', 'success');
        loadIdiomas();
    } catch (error) {
        console.error('Erro ao excluir idioma:', error);
        showNotification('Erro ao excluir idioma', 'error');
    }
}

async function loadCodigosPostais() {
    try {
        showLoading('codigosPostaisTableBody');
        
        const { data, error } = await supabase
            .from('codigos_postais')
            .select('*')
            .order('codigo');
            
        if (error) throw error;
        
        displayCodigosPostais(data || []);
    } catch (error) {
        console.error('Erro ao carregar códigos postais:', error);
        showNotification('Erro ao carregar códigos postais', 'error');
        showEmptyState('codigosPostaisTableBody', 'Erro ao carregar códigos postais');
    }
}

function displayCodigosPostais(codigosPostais) {
    const tbody = document.getElementById('codigosPostaisTableBody');
    tbody.innerHTML = '';
    
    if (codigosPostais.length === 0) {
        showEmptyState('codigosPostaisTableBody', 'Nenhum código postal encontrado');
        return;
    }
    
    codigosPostais.forEach(codigoPostal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${codigoPostal.codigo || '-'}</td>
            <td>${codigoPostal.localidade || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editCodigoPostal(${codigoPostal.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCodigoPostal(${codigoPostal.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editCodigoPostal(id) {
    const fieldMappings = [
        { fieldId: 'codigoPostalId', dbField: 'id' },
        { fieldId: 'codigoPostalCodigo', dbField: 'codigo' },
        { fieldId: 'codigoPostalLocalidade', dbField: 'localidade' }
    ];
    editEntity(id, 'codigos_postais', 'codigoPostalModal', fieldMappings);
}

async function deleteCodigoPostal(id) {
    if (!confirm('Tem certeza que deseja excluir este código postal?')) return;
    
    try {
        const { error } = await supabase
            .from('codigos_postais')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        showNotification('Código postal excluído com sucesso!', 'success');
        loadCodigosPostais();
    } catch (error) {
        console.error('Erro ao excluir código postal:', error);
        showNotification('Erro ao excluir código postal', 'error');
    }
}

// Funções genéricas para as entidades auxiliares
async function handleGenericSubmit(e, table, fields) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validar campos obrigatórios
        const requiredFields = fields.filter(f => f.required);
        for (const field of requiredFields) {
            if (!data[field.name]) {
                showNotification(`Por favor, preencha o campo ${field.label}`, 'error');
                return;
            }
        }
        
        let result;
        if (data.id) {
            // Atualizar registro existente
            const updateData = {};
            fields.forEach(field => {
                if (data[field.name]) {
                    updateData[field.name] = data[field.name];
                }
            });
            
            result = await supabase
                .from(table)
                .update(updateData)
                .eq('id', data.id);
        } else {
            // Criar novo registro
            const insertData = {};
            fields.forEach(field => {
                if (data[field.name]) {
                    insertData[field.name] = data[field.name];
                }
            });
            
            result = await supabase
                .from(table)
                .insert([insertData]);
        }
        
        if (result.error) throw result.error;
        
        const modalId = table.replace('_', '') + 'Modal';
        closeModal(modalId);
        showNotification(data.id ? 'Registro atualizado com sucesso!' : 'Registro criado com sucesso!', 'success');
        
        // Recarregar dados da aba atual
        loadTabData(currentTab);
        
        // Recarregar dropdowns se necessário
        if (['autores', 'editoras', 'generos', 'idiomas', 'codigos_postais'].includes(table)) {
            await populateDropdowns();
        }
        
    } catch (error) {
        console.error(`Erro ao salvar ${table}:`, error);
        showNotification(`Erro ao salvar ${table}`, 'error');
    }
}

// Handlers específicos para cada entidade
async function handleEditoraSubmit(e) {
    await handleGenericSubmit(e, 'editoras', [
        { name: 'nome', label: 'Nome', required: true },
        { name: 'descricao', label: 'Descrição', required: false },
        { name: 'codigo_postal_id', label: 'Código Postal', required: true }
    ]);
}

async function handleCodigoPostalSubmit(e) {
    await handleGenericSubmit(e, 'codigos_postais', [
        { name: 'codigo', label: 'Código', required: true },
        { name: 'localidade', label: 'Localidade', required: true }
    ]);
}

async function handleIdiomaSubmit(e) {
    await handleGenericSubmit(e, 'idiomas', [
        { name: 'nome', label: 'Nome', required: true },
        { name: 'codigo', label: 'Código', required: true }
    ]);
}

async function handleGeneroSubmit(e) {
    await handleGenericSubmit(e, 'generos', [
        { name: 'nome', label: 'Nome', required: true },
        { name: 'descricao', label: 'Descrição', required: false }
    ]);
}

async function handleAutorSubmit(e) {
    await handleGenericSubmit(e, 'autores', [
        { name: 'nome', label: 'Nome', required: true },
        { name: 'descricao', label: 'Descrição', required: false }
    ]);
}

// Funções de busca para as entidades auxiliares
function searchEditoras() {
    const searchTerm = document.getElementById('searchEditoras').value.toLowerCase();
    const rows = document.querySelectorAll('#editorasTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function searchCodigosPostais() {
    const searchTerm = document.getElementById('searchCodigosPostais').value.toLowerCase();
    const rows = document.querySelectorAll('#codigosPostaisTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function searchIdiomas() {
    const searchTerm = document.getElementById('searchIdiomas').value.toLowerCase();
    const rows = document.querySelectorAll('#idiomasTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function searchGeneros() {
    const searchTerm = document.getElementById('searchGeneros').value.toLowerCase();
    const rows = document.querySelectorAll('#generosTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function searchAutores() {
    const searchTerm = document.getElementById('searchAutores').value.toLowerCase();
    const rows = document.querySelectorAll('#autoresTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Função genérica para editar entidades
async function editEntity(id, table, modalId, fieldMappings) {
    try {
        currentEditId = id;
        
        // Buscar dados da entidade
        const { data: entity, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        console.log(`Dados da entidade ${table} para edição:`, entity);
        
        // Preencher o formulário com os dados existentes
        fieldMappings.forEach(mapping => {
            const element = document.getElementById(mapping.fieldId);
            if (element) {
                element.value = entity[mapping.dbField] || '';
            }
        });
        
        // Atualizar título do modal
        const modalTitle = document.querySelector(`#${modalId} .modal-header h3`);
        if (modalTitle) {
            const entityName = modalId.replace('Modal', '');
            modalTitle.textContent = `Editar ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
        }
        
        openModal(modalId);
        
    } catch (error) {
        console.error(`Erro ao carregar dados da entidade ${table}:`, error);
        showNotification(`Erro ao carregar dados da entidade`, 'error');
    }
}

// Funções de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Limpar formulário se for um modal de criação
        if (!currentEditId) {
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                // Limpar campos hidden
                const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
                hiddenInputs.forEach(input => {
                    if (input.name === 'id') {
                        input.value = '';
                    }
                });
                
                // Resetar título do modal para "Novo"
                const modalTitle = modal.querySelector('.modal-header h3');
                if (modalTitle) {
                    if (modalId === 'utenteModal') {
                        modalTitle.textContent = 'Novo Utente';
                    } else if (modalId === 'livroModal') {
                        modalTitle.textContent = 'Novo Livro';
                    } else if (modalId === 'editoraModal') {
                        modalTitle.textContent = 'Nova Editora';
                    } else if (modalId === 'codigoPostalModal') {
                        modalTitle.textContent = 'Novo Código Postal';
                    } else if (modalId === 'idiomaModal') {
                        modalTitle.textContent = 'Novo Idioma';
                    } else if (modalId === 'generoModal') {
                        modalTitle.textContent = 'Novo Género';
                    } else if (modalId === 'autorModal') {
                        modalTitle.textContent = 'Novo Autor';
                    }
                }
            }
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        currentEditId = null;
    }
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        e.target.style.display = 'none';
        currentEditId = null;
    }
});

// Funções de utilidade
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <tr>
                <td colspan="100%" class="loading">
                    <i class="fas fa-spinner"></i>
                    Carregando...
                </td>
            </tr>
        `;
    }
}

function showEmptyState(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <tr>
                <td colspan="100%" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>${message}</h3>
                </td>
            </tr>
        `;
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
}

// Funções de busca para livros em requisições
async function searchLivrosParaRequisicao() {
    const searchTerm = document.getElementById('searchLivroRequisicao').value.toLowerCase();
    
    try {
        const { data, error } = await supabase
            .from('livros_completos')
            .select('*')
            .or(`titulo.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%,isbn.ilike.%${searchTerm}%`)
            .eq('status', 'disponivel')
            .limit(10);
            
        if (error) throw error;
        
        const select = document.getElementById('livroSelecionado');
        select.innerHTML = '<option value="">Selecione um livro</option>';
        
        data.forEach(livro => {
            const option = document.createElement('option');
            option.value = livro.id;
            option.textContent = `${livro.titulo} - ${livro.autor} (${livro.isbn})`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Função para testar dropdowns
function testDropdowns() {
    const dropdowns = [
        'livroAutor',
        'livroEditora', 
        'livroGenero',
        'livroIdioma',
        'utenteCodigoPostal',
        'editoraCodigoPostal'
    ];
    
    console.log('=== TESTE DE DROPDOWNS ===');
    dropdowns.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            console.log(`${id}: ${select.children.length} opções`);
            for (let i = 0; i < select.children.length; i++) {
                console.log(`  ${i}: ${select.children[i].textContent}`);
            }
        } else {
            console.log(`${id}: ELEMENTO NÃO ENCONTRADO`);
        }
    });
    console.log('=== FIM DO TESTE ===');
}

// Inicializar busca em tempo real para livros em requisições
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchLivroRequisicao');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchLivrosParaRequisicao, 300));
    }
    
    // Testar dropdowns após carregamento (para debug)
    setTimeout(() => {
        testDropdowns();
    }, 2000);
});

