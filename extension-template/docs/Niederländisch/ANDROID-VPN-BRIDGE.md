# Android-VPN-bridge in de Extension-sjabloon

De sjabloon bevat een **VPN-bridge-tegel**. In de Android-app opent deze via `browseros://vpn` het native VPN-menu. De Android-integratie gebruikt OpenVPN for Android als externe client.

De Extension kan zelf geen systeemtunnel maken. De externe client levert de tunnel via Androids `VpnService`. De sjabloon bevat geen providerprofielen of VPN-inloggegevens.

## De sjabloon configureren

1. Stel je GitHub-repository in `VpnIntegration.kt` in.
2. Maak `vpn/servers.json` in je repository met het voorbeeld uit de sjabloon.
3. Plaats actuele `.ovpn`-profielen van je VPN-provider in `app/src/main/java/com/example/yourbrowser/VPN/Server/`.
4. Werk `configPath` in het servermanifest bij. Het pad is relatief aan de repository-root.
5. Installeer OpenVPN for Android op het apparaat en importeer het profiel. De gebruiker moet de Android-VPN-toestemming goedkeuren en zelf de inloggegevens invoeren.

Om veiligheids- en licentieredenen verwijdert de gegenereerde ZIP de productie-`.ovpn`-bestanden en bevat deze een voorbeeldmanifest. Zet nooit wachtwoorden, privésleutels of persoonlijke inloggegevens in een openbare repository.
