export default function PlateExample() {
    return (
        <div className="flex sm:flex-row flex-col sm:gap-5 gap-0">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-plate-standard"></div>
                <span>Visitante</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-plate-partner"></div>
                <span>Cooperado</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-plate-event"></div>
                <span>Eventos</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-plate-owner"></div>
                <span>Proprietário</span>
            </div>
        </div>
    )
}