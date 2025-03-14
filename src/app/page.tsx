'use client'
import { definirDescricaoDoTempo } from "@/utils/descricaoDoTempo";
import { obterDiaDaSemana } from "@/utils/diaDaSemana";
import definirDirecaoDoTempo from "@/utils/direcaoDoVento";
import extrairHora from "@/utils/extrairHora";
import { listaDeRedesSociais } from "@/utils/listaDeRedesSociais";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsWind } from "react-icons/bs";
import { FaCloudRain, FaRegCompass } from "react-icons/fa";
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from "react-icons/fa6";
import { FiSunrise } from "react-icons/fi";
import { GiRaining } from "react-icons/gi";
import { LuSunset } from "react-icons/lu";

interface Tempo {
	current_weather: {
		time: string
		temperature: string
		weathercode: number
		winddirection: number
		windspeed: number
	},
	daily: {
		precipitation_probability_mean: number[]
		precipitation_sum: number[]
		temperature_2m_max: number[]
		temperature_2m_min: number[]
		time: string[]
		sunrise: string[]
		sunset: string[]
	},
	hourly: {
		temperature_2m: number[]
		time: number[]
	}
}

export default function Home() {
	const [tempo, setTempo] = useState<Tempo | null>(null);
	const [localizacao, setLocalizacao] = useState<[number, number]>([-23.537354436105627, -46.631072599924345])

	const [cidade, setCidade] = useState('São Paulo');
	const [elementoCidade, setElementoCidade] = useState('São Paulo');
	const [, setErro] = useState('');
	const [imagem, setImagem] = useState<string | null>(null)

	useEffect(() => {
		async function fetchWeather() {
			try {
				const response = await fetch(`/api/weather?lat=${localizacao[0]}&lon=${localizacao[1]}`)
				const data = await response.json()
				setTempo(data)
			} catch (error) {
				console.error("Erro ao obter clima", error)
			}
		}
		fetchWeather()
	}, [localizacao])

	useEffect(() => {
		if (tempo?.current_weather.weathercode !== undefined) {
			setImagem(definirDescricaoDoTempo(tempo.current_weather.weathercode).imagem);
		}
	}, [tempo])

	const handlePesquisa = async () => {
		try {
			const response = await fetch(`/api/geocode?query=${cidade}`)

			if (!response.ok) {
				const errorData = await response.json()
				setErro(errorData.error || 'Erro ao buscar a cidade')
				return
			}
			const data = await response.json()
			console.log(data)
			setLocalizacao([data.latitude, data.longitude])
			setErro('')
			setElementoCidade(cidade)
		} catch (error) {
			console.error(error)
			setErro('Erro ao buscar a cidade')
		}
	}

	const obterCidadePorCoordenadas = async (latitude: number, longitude: number) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
			);

			if (!response.ok) throw new Error('Erro ao obter a cidade');

			const data = await response.json();
			console.log(data)
			return data.address.city || data.address.town || data.address.village || 'Cidade não encontrada';
		} catch (error) {
			console.error(error);
			return 'Erro ao buscar a cidade';
		}
	};

	const getLocation = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const lat = position.coords.latitude
					const lon = position.coords.longitude

					const cidadeObtida = await obterCidadePorCoordenadas(lat, lon);
					console.log(cidadeObtida)
					setCidade(cidadeObtida);
					setElementoCidade(cidadeObtida);
					setLocalizacao([lat, lon]);
				},
				(error) => {
					const mensagensErro: Record<number, string> = {
						1: 'Permissão de localização negada pelo usuário.',
						2: 'Informações de localização indisponíveis.',
						3: 'Tempo limite para obter a localização expirado.',
					};
					setErro(mensagensErro[error.code] || 'Erro desconhecido ao obter a localização.');
				},
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		} else {
			setErro('A geolocalização não é suportada pelo seu navegador.');
		}
	};


	return (
		<div className="w-screen min-h-screen overflow-hidden bg-zinc-200 text-black"
			style={{
				backgroundImage: `url(${imagem})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}}>
			<div className="p-4">
				{/* input de busca */}
				<div className="w-full text-white overflow-hidden gap-x-2 gap-y-1" style={{ display: 'grid', gridTemplateColumns: '1fr 120px' }}>
					<input
						type="text"
						className="h-[30px] px-2 py-1 rounded-md uppercase font-bold w-full border-2 border-blue-900 text-sm"
						placeholder="Digite o nome da cidade"
						value={cidade}
						onChange={(e) => setCidade(e.target.value)}
						style={{ backgroundColor: 'var(--azul-claro)' }}
					/>
					<button onClick={handlePesquisa} className="uppercase font-black rounded-lg" style={{ backgroundColor: 'var(--azul)' }}>Buscar</button>
					<button onClick={getLocation} className="col-start-1 col-end-3 uppercase font-bold text-lg py-1 rounded-lg" style={{ backgroundColor: 'var(--azul)' }}>pegar localização atual</button>
				</div>

				{/* Dados da previsão */}
				{
					tempo != null ? (
						<div className="mt-6">
							<h2 className="uppercase font-black text-4xl text-center text-white mb-8" style={{ textShadow: '2px 2px 3px black' }}>{elementoCidade}</h2>
							<div className="flex flex-col gap-6">
								{/* Temperatura Atual e descrição do tempo */}
								<div className="flex flex-col text-white" style={{ textShadow: '2px 2px 3px black' }}>
									<p className="uppercase font-black text-6xl text-center">{tempo.current_weather.temperature}ºC</p>
									<p className="uppercase font-semibold text-2xl text-center">{definirDescricaoDoTempo(tempo.current_weather.weathercode).texto}</p>
								</div>

								{/* Temperatura Máxima e Mínima do dia */}
								<div className="grid grid-cols-2 gap-2 text-white" style={{ textShadow: '2px 2px 3px black' }}>
									<div className="w-32 h-16 justify-self-center" style={{ display: 'grid', gridTemplateColumns: '45px 1fr' }}>
										<div className="text-4xl flex justify-center items-center">
											<FaTemperatureArrowUp className="text-red-600" />
										</div>
										<p className="text-center self-center text-3xl font-bold">{tempo.daily.temperature_2m_max[0].toFixed(0)}ºC</p>
									</div>
									<div className="w-32 h-16 justify-self-center" style={{ display: 'grid', gridTemplateColumns: '45px 1fr' }}>
										<div className="text-4xl flex justify-center items-center">
											<FaTemperatureArrowDown className="text-blue-700" />
										</div>
										<p className="text-center self-center text-3xl font-bold">{tempo.daily.temperature_2m_min[0].toFixed(0)}ºC</p>
									</div>
								</div>

								{/* Outros dados do dia */}
								<div className="grid grid-cols-2 gap-2">
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg" style={{ display: 'grid', gridTemplateRows: '1fr 40px', backgroundColor: 'var(--azul)' }}>
											<div className="text-5xl flex justify-center items-center">
												<BsWind />
											</div>
											<p className="text-center self-center">{tempo.current_weather.windspeed}Km/h</p>
										</div>
									</div>
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg" style={{ display: 'grid', gridTemplateRows: '1fr 40px', backgroundColor: 'var(--azul)' }}>
											<div className="text-5xl flex justify-center items-center">
												<FaRegCompass />
											</div>
											<p className="text-center leading-4 self-center">{definirDirecaoDoTempo(tempo.current_weather.winddirection)}</p>
										</div>
									</div>
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg" style={{ display: 'grid', gridTemplateRows: '1fr 40px', backgroundColor: 'var(--azul)' }}>
											<div className="text-5xl flex justify-center items-center">
												<FaCloudRain />
											</div>
											<p className="text-center leading-4 self-center">{tempo.daily.precipitation_probability_mean[0]}%</p>
										</div>
									</div>
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg" style={{ display: 'grid', gridTemplateRows: '1fr 40px', backgroundColor: 'var(--azul)' }}>
											<div className="text-5xl flex justify-center items-center">
												<GiRaining />
											</div>
											<p className="text-center leading-4 self-center">{tempo.daily.precipitation_sum[0]}mm</p>
										</div>
									</div>
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg bg-orange-500" style={{ display: 'grid', gridTemplateRows: '1fr 40px'}}>
											<div className="text-5xl flex justify-center items-center">
												<FiSunrise />
											</div>
											<p className="text-center leading-4 self-center text-xl font-black">{extrairHora(tempo.daily.sunrise[0])}</p>
										</div>
									</div>
									<div className="flex justify-center items-center">
										<div className="w-full max-w-[120px] mx-auto p-2 h-24 text-white py-2 rounded-lg bg-zinc-950" style={{ display: 'grid', gridTemplateRows: '1fr 40px'}}>
											<div className="text-5xl flex justify-center items-center">
												<LuSunset />
											</div>
											<p className="text-center leading-4 self-center text-xl font-black">{extrairHora(tempo.daily.sunset[0])}</p>
										</div>
									</div>
								</div>

								{/* Tempo de hora em hora */}
								<div className="w-full p-4 flex flex-col gap-4 text-white" style={{ backgroundColor: 'var(--azul)' }}>
									<h2 className="uppercase font-black text-center text-2xl leading-6">Tempo de hora em hora:</h2>
									<div className="overflow-x-auto pb-2">
										<ul className="flex space-x-4">
											{tempo.hourly.temperature_2m.slice(0, 24).map((temperatura, i) => {
												const listaDeHoras = tempo.hourly.time.slice(0, 24).map(hora => extrairHora(`${hora}`))
												return (
													<li key={i} className=" bg-gray-200 rounded flex flex-col justify-center items-center px-4 h-20 text-black" >
														<p className="font-black text-2xl">
															{temperatura.toFixed(0)}°C
														</p>
														<p className="font-semibold">
															{listaDeHoras[i]}
														</p>
													</li>
												)
											})}
										</ul>
									</div>
								</div>

								{/* Previsão para os próximos dias */}
								<div className="w-full p-4 flex flex-col gap-4 text-white" style={{ backgroundColor: 'var(--azul)' }}>
									<h2 className="uppercase font-black text-center text-2xl leading-6">Previsão do tempo para os próximos dias:</h2>
									<div className="overflow-x-auto pb-2">
										<ul className="flex gap-4">
											{
												tempo.daily.time.map((t, i) => {
													const tempMax = tempo.daily.temperature_2m_max
													const tempMin = tempo.daily.temperature_2m_min
													const probabilidadeDeChuva = tempo.daily.precipitation_probability_mean
													const quantidadeDeChuva = tempo.daily.precipitation_sum
													return (
														<li key={i} className="border-2 border-black text-black rounded-lg bg-zinc-200 flex flex-col gap-1">
															<div className="flex flex-col w-32">
																<div className="w-full flex justify-center items-center text-3xl font-black">
																	<p>{((tempMax[i] + tempMin[i]) / 2).toFixed(0)}ºC</p>
																</div>
															</div>
															<div className="grid grid-cols-2">
																<div className="text-lg uppercase font-semibold mx-auto flex flex-col">
																	<div className="self-center justify-self-center">
																		<FaTemperatureArrowUp />
																	</div>
																	<p className="self-center justify-self-center text-[.8em]">{tempMax[i]}ºC</p>
																</div>
																<div className="text-lg uppercase font-semibold mx-auto flex flex-col">
																	<div className="self-center justify-self-center">
																		<FaTemperatureArrowDown />
																	</div>
																	<p className="self-center justify-self-center text-[.8em]">{tempMin[i]}ºC</p>
																</div>
															</div>
															<div className="gap-1 grid grid-cols-2">
																<div className="justify-self-center flex justify-center items-center flex-col">
																	<FaCloudRain className="text-2xl" />
																	<p className="text-[.8em]">{probabilidadeDeChuva[i]}%</p>
																</div>
																<div className="justify-self-center flex justify-center items-center flex-col">
																	<GiRaining className="text-2xl" />
																	<p className="text-[.8em]">{quantidadeDeChuva[i]}mm</p>
																</div>
															</div>
															<p className="whitespace-nowrap font-bold text-lg text-center capitalize">{obterDiaDaSemana(t)}</p>
														</li>
													)
												})
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
					) : (
						<p className="uppercase font-bold text-3xl text-center min-h-[80vh] my-auto flex justify-center items-center">Carregando informações...</p>
					)
				}
			</div>
			<footer className="p-2 bg-black text-white">
				<div className="flex flex-col px-2 py-1 bg-black text-white md:flex-row">
					<div className="flex justify-center items-center w-full">
						<p className="w-full font-bold uppercase text-center md:text-start">Produzido por dimi endrix martins miranda</p>
					</div>
					<ul className="grid grid-cols-4 mt-4 mb-2 max-w-[500px] mx-auto w-full xl:m-0 xl:max-w-[300px] xl:ml-auto">
						{
							listaDeRedesSociais.map((rede, i) => {
								return (
									<li key={i} className="flex justify-center items-center text-3xl transition-all hover:scale-[1.1]">
										<Link href={rede.link}>{rede.icone}</Link>
									</li>
								)
							})
						}
					</ul>
				</div>
			</footer>
		</div>
	);
}
