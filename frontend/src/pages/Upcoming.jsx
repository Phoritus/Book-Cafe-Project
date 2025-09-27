import logo from "../assets/Coffee.svg";
import QRCode from 'react-qr-code';

function Upcoming() {
    const bookingDetails = "booking-room4-11092025"
    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-[#FBF7F3] p-4" style={{ backgroundColor: "#F6F3ED" }}>
                {/* Header Section */}
                <header className="flex flex-col items-center gap-4 mb-6 mt-3 justify-center ">
                    <img src={logo} alt="Logo" className="h-16 w-16 text-brown-500 mb-1" />
                    <h1 className="title text-2xl sm:text-3xl md:text-4xl font-bold text-[#53311C] text-center font-crimson mb-1">Upcoming Booking</h1>
                    <p className="text-sm text-[#B37E32] text-center ">
                        Check in with staff within 30 minutes of your booking start,<br/> or your booking will be cancelled
                    </p>
                </header>

                {/* Main Booking Card */}
                <div className="bg-white rounded-2xl shadow-md p-6 mt-8 w-full max-w-sm mx-auto flex flex-col items-center font-Inter">
                    {/* Room Name */}
                    <h2 className="text-3xl text-[#53311C] mb-6">
                        Room 4
                    </h2>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-6 text-sm text-[#B37E32]  w-full">
                        <div>
                            <div className=" mb-4">Date</div>
                            <div className=" pb-4 mb-4 text-[#3C2415]">11 / 09 / 2025</div>
                            <div className="pt-2 border-b border-[#B37E32]"></div>
                        </div>
                        <div>
                            <div className=" mb-4">Total Time</div>
                            <div className=" pb-4 mb-4 text-[#3C2415]">3</div>
                            <div className="pt-2 border-b border-[#B37E32]"></div>
                        </div>
                        <div>
                            <div className=" mb-4">Start Time</div>
                            <div className="pb-4 mb-4  text-[#3C2415]">09:00</div>
                            <div className="pt-2 border-b border-[#B37E32]"></div>
                        </div>
                        <div>
                            <div className="  mb-4">End Time</div>
                            <div className=" pb-4 mb-4  text-[#3C2415]">12:00</div>
                            <div className="pt-2 border-b border-[#B37E32]"></div>
                        </div>
                    </div>

                    {/* QR Code and Instructions */}
                    <div className="flex flex-col items-center mb-6 mt-4 ">
                        <QRCode value={bookingDetails} style={{ height: "auto", width: "45%" }} />
                        <p className="text-sm text-[#53311C] mt-2 text-center max-w-xs">
                            Present your QR code and ID card at check-in
                        </p>
                    </div>

                    {/* Price and Cancel Button */}
                    <div className="flex flex-col items-center w-full">
                        <p className="text-lg text-[#BB8F6E] font-semibold mb-4">
                            Price <span className="text-[#53311C] ">150 THB</span>
                        </p>
                        <button style={{ height: "auto", width: "45%" }} className="w-full bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600 transition duration-300 mt-2" onClick={() => window.history.back()}>
                            Cancel Booking
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Upcoming;
