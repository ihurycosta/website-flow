--[[
    Flow Roleplay - Integração com Sistema de Compras
    Arquivo: server-integration.lua
    
    Este arquivo deve ser colocado no seu servidor MTA e configurado
    para receber as requisições do sistema de pagamento.
]]

-- Configurações
local API_KEY = "SUA_API_KEY_AQUI" -- Mesma chave configurada no PHP
local WEBHOOK_PORT = 22005 -- Porta para receber webhooks (diferente da porta do servidor)

-- Tabela para armazenar VIPs ativos
local activeVips = {}

-- Função para validar API Key
local function validateApiKey(key)
    return key == API_KEY
end

-- Função para adicionar VIP ao jogador
local function addVipToPlayer(playerName, vipType, durationDays, purchaseId)
    local player = getPlayerFromName(playerName)
    
    -- Calcular data de expiração
    local expirationTime = getRealTime().timestamp + (durationDays * 24 * 60 * 60)
    
    -- Dados do VIP
    local vipData = {
        type = vipType,
        expiration = expirationTime,
        purchaseId = purchaseId,
        activated = getRealTime().timestamp
    }
    
    -- Salvar no banco de dados do servidor (adapte conforme seu sistema)
    local query = [[
        INSERT INTO player_vips (player_name, vip_type, expiration_date, purchase_id, created_at) 
        VALUES (?, ?, FROM_UNIXTIME(?), ?, NOW())
        ON DUPLICATE KEY UPDATE 
        vip_type = VALUES(vip_type),
        expiration_date = VALUES(expiration_date),
        purchase_id = VALUES(purchase_id)
    ]]
    
    dbExec(db, query, playerName, vipType, expirationTime, purchaseId)
    
    -- Armazenar na memória
    activeVips[playerName] = vipData
    
    -- Se o jogador estiver online, aplicar benefícios imediatamente
    if player then
        applyVipBenefits(player, vipType)
        outputChatBox("#00FF00[VIP] Seu VIP " .. vipType:upper() .. " foi ativado com sucesso!", player, 255, 255, 255, true)
        outputChatBox("#00FF00[VIP] Válido até: " .. os.date("%d/%m/%Y %H:%M", expirationTime), player, 255, 255, 255, true)
    end
    
    -- Log da ativação
    outputServerLog("[VIP SYSTEM] VIP " .. vipType .. " ativado para " .. playerName .. " (Purchase ID: " .. purchaseId .. ")")
    
    return true
end

-- Função para aplicar benefícios do VIP
local function applyVipBenefits(player, vipType)
    if not isElement(player) then return end
    
    local playerName = getPlayerName(player)
    
    -- Benefícios do VIP Ouro
    if vipType == "gold" then
        -- Dar coins mensais
        givePlayerMoney(player, 5000)
        
        -- Definir multiplicador de XP
        setElementData(player, "vip.xp_multiplier", 2)
        
        -- Tag no nome
        setPlayerNametagText(player, "[VIP] " .. playerName)
        setPlayerNametagColor(player, 255, 215, 0) -- Dourado
        
        -- Acesso a veículos VIP (adapte conforme seu sistema)
        setElementData(player, "vip.vehicle_access", "gold")
        
    -- Benefícios do VIP Diamante
    elseif vipType == "diamond" then
        -- Dar coins mensais
        givePlayerMoney(player, 10000)
        
        -- Definir multiplicador de XP
        setElementData(player, "vip.xp_multiplier", 3)
        
        -- Tag no nome
        setPlayerNametagText(player, "[VIP♦] " .. playerName)
        setPlayerNametagColor(player, 185, 242, 255) -- Azul diamante
        
        -- Acesso a veículos VIP
        setElementData(player, "vip.vehicle_access", "diamond")
        
        -- Comandos especiais
        setElementData(player, "vip.special_commands", true)
    end
    
    -- Marcar como VIP ativo
    setElementData(player, "vip.active", true)
    setElementData(player, "vip.type", vipType)
end

-- Função para verificar se VIP expirou
local function checkVipExpiration(player)
    local playerName = getPlayerName(player)
    local vipData = activeVips[playerName]
    
    if vipData and getRealTime().timestamp > vipData.expiration then
        -- VIP expirou
        removeVipBenefits(player)
        activeVips[playerName] = nil
        
        outputChatBox("#FF0000[VIP] Seu VIP expirou! Renove para continuar aproveitando os benefícios.", player, 255, 255, 255, true)
        outputServerLog("[VIP SYSTEM] VIP expirado para " .. playerName)
        
        return false
    end
    
    return vipData ~= nil
end

-- Função para remover benefícios do VIP
local function removeVipBenefits(player)
    if not isElement(player) then return end
    
    local playerName = getPlayerName(player)
    
    -- Remover dados VIP
    removeElementData(player, "vip.active")
    removeElementData(player, "vip.type")
    removeElementData(player, "vip.xp_multiplier")
    removeElementData(player, "vip.vehicle_access")
    removeElementData(player, "vip.special_commands")
    
    -- Restaurar nome normal
    setPlayerNametagText(player, playerName)
    setPlayerNametagColor(player, 255, 255, 255) -- Branco padrão
end

-- Carregar VIPs do banco de dados na inicialização
local function loadVipsFromDatabase()
    local query = "SELECT * FROM player_vips WHERE expiration_date > NOW()"
    local result = dbPoll(dbQuery(db, query), -1)
    
    if result then
        for _, row in ipairs(result) do
            activeVips[row.player_name] = {
                type = row.vip_type,
                expiration = getTimestampFromString(row.expiration_date),
                purchaseId = row.purchase_id,
                activated = getTimestampFromString(row.created_at)
            }
        end
        
        outputServerLog("[VIP SYSTEM] Carregados " .. #result .. " VIPs ativos do banco de dados")
    end
end

-- Event handlers
addEventHandler("onResourceStart", resourceRoot, function()
    -- Carregar VIPs do banco
    loadVipsFromDatabase()
    
    -- Configurar servidor HTTP para receber webhooks
    local httpServer = createHTTPServer(WEBHOOK_PORT)
    if httpServer then
        outputServerLog("[VIP SYSTEM] Servidor HTTP iniciado na porta " .. WEBHOOK_PORT)
    else
        outputServerLog("[VIP SYSTEM] ERRO: Não foi possível iniciar servidor HTTP")
    end
end)

addEventHandler("onPlayerJoin", root, function()
    local playerName = getPlayerName(source)
    local vipData = activeVips[playerName]
    
    if vipData then
        -- Verificar se não expirou
        if checkVipExpiration(source) then
            -- Aplicar benefícios
            setTimer(function()
                if isElement(source) then
                    applyVipBenefits(source, vipData.type)
                end
            end, 2000, 1) -- Delay para garantir que o jogador carregou completamente
        end
    end
end)

addEventHandler("onPlayerQuit", root, function()
    -- Limpar dados temporários se necessário
end)

-- Handler para requisições HTTP (webhook)
function handleVipRequest(request, response)
    local postData = request.postData
    if not postData then
        response:write("No data received")
        return
    end
    
    local data = fromJSON(postData)
    if not data then
        response:write("Invalid JSON")
        return
    end
    
    -- Validar API Key
    if not validateApiKey(data.api_key or "") then
        response:write("Invalid API key")
        return
    end
    
    -- Processar ação
    if data.action == "add_vip" then
        local success = addVipToPlayer(
            data.player_id,
            data.vip_type,
            data.duration_days,
            data.purchase_id
        )
        
        if success then
            response:write("VIP added successfully")
        else
            response:write("Failed to add VIP")
        end
    else
        response:write("Unknown action")
    end
end

-- Registrar handler HTTP
addEventHandler("onHTTPRequest", resourceRoot, handleVipRequest)

-- Comandos administrativos
addCommandHandler("checkvip", function(player, cmd, targetName)
    if not hasObjectPermissionTo(player, "general.adminpanel") then
        return
    end
    
    targetName = targetName or getPlayerName(player)
    local vipData = activeVips[targetName]
    
    if vipData then
        local timeLeft = vipData.expiration - getRealTime().timestamp
        local daysLeft = math.floor(timeLeft / (24 * 60 * 60))
        
        outputChatBox("VIP Info para " .. targetName .. ":", player)
        outputChatBox("Tipo: " .. vipData.type:upper(), player)
        outputChatBox("Expira em: " .. daysLeft .. " dias", player)
        outputChatBox("Purchase ID: " .. vipData.purchaseId, player)
    else
        outputChatBox(targetName .. " não possui VIP ativo.", player)
    end
end)

addCommandHandler("removevip", function(player, cmd, targetName)
    if not hasObjectPermissionTo(player, "general.adminpanel") then
        return
    end
    
    if not targetName then
        outputChatBox("Use: /removevip <nome>", player)
        return
    end
    
    local targetPlayer = getPlayerFromName(targetName)
    if targetPlayer then
        removeVipBenefits(targetPlayer)
    end
    
    activeVips[targetName] = nil
    
    -- Remover do banco
    dbExec(db, "DELETE FROM player_vips WHERE player_name = ?", targetName)
    
    outputChatBox("VIP removido de " .. targetName, player)
    outputServerLog("[VIP SYSTEM] VIP removido de " .. targetName .. " por " .. getPlayerName(player))
end)

-- Timer para verificar VIPs expirados (a cada hora)
setTimer(function()
    for playerName, vipData in pairs(activeVips) do
        if getRealTime().timestamp > vipData.expiration then
            local player = getPlayerFromName(playerName)
            if player then
                removeVipBenefits(player)
                outputChatBox("#FF0000[VIP] Seu VIP expirou! Renove para continuar aproveitando os benefícios.", player, 255, 255, 255, true)
            end
            
            activeVips[playerName] = nil
            outputServerLog("[VIP SYSTEM] VIP expirado para " .. playerName)
        end
    end
end, 3600000, 0) -- 1 hora em milissegundos

-- Exportar funções para outros recursos
function isPlayerVip(player)
    local playerName = getPlayerName(player)
    return activeVips[playerName] ~= nil
end

function getPlayerVipType(player)
    local playerName = getPlayerName(player)
    local vipData = activeVips[playerName]
    return vipData and vipData.type or false
end

function getPlayerVipExpiration(player)
    local playerName = getPlayerName(player)
    local vipData = activeVips[playerName]
    return vipData and vipData.expiration or false
end