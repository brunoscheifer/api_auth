# JWT - JSON Web Tokens #

Existem vários algoritimos e padrões que transfomam informações em um token, isto é, uma chave de autenticação única, que faz sentido para o serviço ou aplicação que esteja tentando acessar no momento. Um desses padrões é o JWT, que é seguro por permitir uma autenticação entre duas partes através de um token assinado.
Um JWT é um padrão para autenticação e troca de informações definido pela RFC7519. Nele é possível armazenar de forma segura e compacta objetos JSON.


# Pacote jsonwebtoken no Node.js #
Para o funcionamento é preciso instalar o pacote jsonwebtoken e depois usá-lo para gerar e verificar tokens JWT.
Após instalar, é preciso importar o pacote no arquivo Node.js.
Para gerar um token, foi utlizado sing. Ele cria um token com base em payload e uma chave secreta que será usada para assinar o token.
 
# Rotas middleware #
O Middleware será responsável por verificar o token enviado pelo cliente, geralmente através dos cabeçalhos HTTP 
