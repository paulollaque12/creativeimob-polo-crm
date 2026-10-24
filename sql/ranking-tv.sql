/*polo-tv v2*/
WITH
p AS (SELECT DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY) L),
per AS (
  SELECT 'ano' k, DATE_TRUNC(L, YEAR) a, L b FROM p UNION ALL
  SELECT 'mes', DATE_TRUNC(L, MONTH), L FROM p UNION ALL
  SELECT 'mes_ant', DATE_SUB(DATE_TRUNC(L, MONTH), INTERVAL 1 MONTH),
    LEAST(DATE_ADD(DATE_SUB(DATE_TRUNC(L, MONTH), INTERVAL 1 MONTH), INTERVAL DATE_DIFF(L, DATE_TRUNC(L, MONTH), DAY) DAY), DATE_SUB(DATE_TRUNC(L, MONTH), INTERVAL 1 DAY)) FROM p UNION ALL
  SELECT 'sem', DATE_TRUNC(L, WEEK(MONDAY)), L FROM p UNION ALL
  SELECT 'sem_ant', DATE_SUB(DATE_TRUNC(L, WEEK(MONDAY)), INTERVAL 7 DAY), DATE_SUB(L, INTERVAL 7 DAY) FROM p
),
lim AS (SELECT MIN(a) a0, MAX(b) b0 FROM per),
g AS (
  SELECT CodigoNegocio x, MIN(Data) d, ANY_VALUE(CodigoEmImovel) imo, MAX(valornegocio_dn) val, ARRAY_AGG(DISTINCT IFNULL(nome_usuario, '')) cors
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`, lim
  WHERE Assunto IN ('Negócio ganho', 'Negocio Ganho via API') AND Data BETWEEN DATE_SUB(a0, INTERVAL 40 DAY) AND b0
  GROUP BY 1
),
u AS (SELECT codigo, ANY_VALUE(nome) nome FROM `vistaprocessos.nitro_dados.vista_usuarios` WHERE imobiliaria_id = 1005 GROUP BY 1),
ev AS (
  SELECT 'leads' m, DATE(c.Data) d, c.nome_usuario cor, c.CodigoCliente x, CAST(NULL AS STRING) imo, CAST(NULL AS FLOAT64) val
  FROM `vistaprocessos.nitro_dados.vw_consolidado_clientes_capturados_polo` c, lim
  WHERE DATE(c.Data) BETWEEN a0 AND b0
  UNION ALL
  SELECT CASE WHEN EtapaAcaoId IN ('13','16') THEN 'atd' WHEN EtapaAcaoId = '14' THEN 'agd' ELSE 'vis' END, Data, nome_usuario, CodigoCliente, NULL, NULL
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`, lim
  WHERE Data BETWEEN a0 AND b0 AND EtapaAcaoId IN ('13','16','14','2')
    AND (Assunto IS NULL OR Assunto NOT IN ('Negócio ganho','Negócio perdido'))
  UNION ALL
  SELECT 'vend', d, NULLIF(c, ''), x, imo, CAST(val AS FLOAT64) FROM g, UNNEST(cors) c, lim WHERE d BETWEEN a0 AND b0
  UNION ALL
  SELECT 'agc', DATE(i.data_cadastro), u.nome, i.codigo, NULL, NULL
  FROM `vistaprocessos.nitro_dados.vista_imoveis` i LEFT JOIN u ON u.codigo = i.codigo_corretor, lim
  WHERE i.imobiliaria_id = 1005 AND DATE(i.data_cadastro) BETWEEN a0 AND b0
),
j AS (
  SELECT per.k, ev.m, ev.cor, ev.x, ev.imo, ev.val FROM per JOIN ev ON ev.d BETWEEN per.a AND per.b WHERE ev.cor IS NOT NULL
  UNION ALL
  SELECT per.k, ev.m, '*', ev.x, ev.imo, ev.val FROM per JOIN ev ON ev.d BETWEEN per.a AND per.b
),
cnt AS (SELECT k, m, cor, COUNT(DISTINCT x) n FROM j GROUP BY 1, 2, 3),
vg AS (
  SELECT k, 'vgv' m, cor, SUM(mx) v FROM (
    SELECT k, cor, COALESCE(imo, CONCAT('n', x)) ik, MAX(val) mx FROM j WHERE m = 'vend' GROUP BY 1, 2, 3
  ) GROUP BY 1, 2, 3
),
lin AS (
  SELECT k, m, CONCAT(cor, '|', CAST(n AS STRING)) t FROM cnt
  UNION ALL
  SELECT k, m, CONCAT(cor, '|', CAST(CAST(ROUND(v) AS INT64) AS STRING)) FROM vg
)
SELECT k, m, STRING_AGG(t, ';' ORDER BY t) s FROM lin GROUP BY 1, 2
UNION ALL
SELECT k, '_per', CONCAT(CAST(a AS STRING), '|', CAST(b AS STRING)) FROM per
